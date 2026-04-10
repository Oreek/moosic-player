import { trackTitleFilter } from '@/helpers/filter'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system/legacy'
import { useEffect, useMemo, useState } from 'react'

const { StorageAccessFramework } = FileSystem

export type LocalTrack = {
	url: string
	title: string
	artist?: string
	artwork?: string
	rating?: number
	playlist?: string[]
}

// const AUDIO_PAGE_SIZE = 500

const DIRS_STORAGE_KEY = 'moosic_player_dirs'

function filenameToTitle(filename?: string) {
	if (!filename) return 'Unknown Title'
	return filename.replace(/\.[^/.]+$/, '')
}

export function useLocalTracks(search: string) {
	const [tracks, setTracks] = useState<LocalTrack[]>([])
	const [loading, setLoading] = useState(true)
	const [statusMessage, setStatusMessage] = useState('Initializing...')
	const [permissionDenied, setPermissionDenied] = useState(false)

	const crawlDirectory = async (dirUri: string, depth = 0): Promise<string[]> => {
		const audioFiles: string[] = []
		if (depth > 4) return audioFiles

		try {
			const files = await StorageAccessFramework.readDirectoryAsync(dirUri)
			for (const fileUri of files) {
				if (fileUri.match(/\.(mp3|flac|wav)$/i)) {
					audioFiles.push(fileUri)
				} else {
					const info = await FileSystem.getInfoAsync(fileUri)
					if (info.isDirectory) {
						const subFiles = await crawlDirectory(fileUri, depth + 1)
						audioFiles.push(...subFiles)
					}
				}
			}
		} catch (e) {
			console.log('Error crawling directory URI:', dirUri, e)
		}
		return audioFiles
	}

	const loadDirectories = async () => {
		try {
			setLoading(true)
			setStatusMessage('Loading saved folders...')
			setPermissionDenied(false)

			const data = await AsyncStorage.getItem(DIRS_STORAGE_KEY)
			const uris: string[] = data ? JSON.parse(data) : []

			if (uris.length === 0) {
				setTracks([])
				setStatusMessage('No folders added. Please add a folder.')
				setLoading(false)
				return
			}

			await scanDirectories(uris)
		} catch (error) {
			setStatusMessage(`Error loading saved folders: ${error}`)
			setLoading(false)
		}
	}

	const scanDirectories = async (uris: string[]) => {
		try {
			setLoading(true)
			setTracks([])

			const allAudioFiles: LocalTrack[] = []

			for (const uri of uris) {
				setStatusMessage(`Scanning ${decodeURIComponent(uri.split('%2F').pop() || uri)}...`)
				const audioUris = await crawlDirectory(uri, 0)

				for (const fileUri of audioUris) {
					const filename = decodeURIComponent(fileUri.split('%2F').pop() || 'Unknown')
					allAudioFiles.push({
						url: fileUri,
						title: filenameToTitle(filename),
						artist: 'Unknown Artist',
						artwork: undefined,
						rating: 0,
						playlist: [],
					})
				}
			}

			if (allAudioFiles.length === 0) {
				setStatusMessage('No supported audio files found in selected folders.')
			} else {
				setStatusMessage(`Loaded ${allAudioFiles.length} songs.`)
			}

			setTracks(allAudioFiles)
		} catch (error) {
			setStatusMessage(`Error scanning folders ${error}`)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		loadDirectories()
	}, [])

	const addFolder = async () => {
		try {
			const permission = await StorageAccessFramework.requestDirectoryPermissionsAsync()
			if (permission.granted) {
				const data = await AsyncStorage.getItem(DIRS_STORAGE_KEY)
				const uris: string[] = data ? JSON.parse(data) : []

				if (!uris.includes(permission.directoryUri)) {
					uris.push(permission.directoryUri)
					await AsyncStorage.setItem(DIRS_STORAGE_KEY, JSON.stringify(uris))
				}

				await scanDirectories(uris)
			}
		} catch (error) {
			console.error('Error adding folder', error)
			setStatusMessage('Failed to add folder. Prolly permission denied?')
		}
	}

	const cleanFolders = async () => {
		try {
			await AsyncStorage.removeItem(DIRS_STORAGE_KEY)
			setTracks([])
			setStatusMessage('all folders cleared. add folders to listen to songs')
		} catch (e) {
			console.error('error cleaning folders', e)
		}
	}

	const filteredTracks = useMemo(() => {
		if (!search) return tracks
		return tracks.filter(trackTitleFilter(search))
	}, [search, tracks])

	return {
		tracks: filteredTracks,
		loading,
		statusMessage,
		permissionDenied,
		addFolder,
		cleanFolders,
	}
}
