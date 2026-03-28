import library from '@/assets/data/library.json'
import { trackTitleFilter } from '@/helpers/filter'
import MediaLibrary from 'expo-media-library'
import { useEffect, useMemo, useState } from 'react'

export type LocalTrack = {
	url: string
	title: string
	artist?: string
	artwork?: string
	rating?: number
	playlist?: string[]
}

const AUDIO_PAGE_SIZE = 500

function filenameToTitle(filename?: string) {
	if (!filename) return 'Unknown Title'
	return filename.replace(/\.[^/.]+$/, '')
}

export function useLocalTracks(search: string) {
	const [tracks, setTracks] = useState<LocalTrack[]>([])
	const [loading, setLoading] = useState(true)
	const [statusMessage, setStatusMessage] = useState('Loading songs...')
	const [permissionDenied, setPermissionDenied] = useState(false)

	useEffect(() => {
		let active = true

		async function load() {
			setLoading(true)
			setStatusMessage('requesting media permission')
			setPermissionDenied(false)

			try {
				const permission = await MediaLibrary.requestPermissionsAsync()
				if (!active) return
				if (!permission.granted) {
					setPermissionDenied(true)
					setTracks(library as LocalTrack[])
					setStatusMessage('Media permission denied. Showing demo library')
					return
				}

				setStatusMessage('Scanning device audio library...')

				let all: MediaLibrary.Asset[] = []
				let after: string | undefined
				let hasNextPage = true

				while (hasNextPage) {
					const page = await MediaLibrary.getAssetsAsync({
						mediaType: [MediaLibrary.MediaType.audio],
						first: AUDIO_PAGE_SIZE,
						after,
						sortBy: [MediaLibrary.SortBy.creationTime],
					})

					all = all.concat(page.assets)
					hasNextPage = page.hasNextPage
					after = page.endCursor ?? undefined
				}

				if (!active) return

				const mapped: LocalTrack[] = all.map((asset) => ({
					url: asset.uri,
					title: filenameToTitle(asset.filename),
					artist: 'Unknown Artist',
					artwork: undefined,
					rating: 0,
					playlist: [],
				}))

				if (mapped.length === 0) {
					setTracks(library as LocalTrack[])
					setStatusMessage('No device songs found. Showing demo library.')
				} else {
					setTracks(mapped)
					setStatusMessage(`Loaded ${mapped.length} songs from device.`)
				}
			} catch (error) {
				if (!active) return
				setTracks(library as LocalTrack[])
				setStatusMessage(
					`Could not read device media library. Showing demo library. (${error instanceof Error ? error.message : String(error)})`,
				)
			} finally {
				if (active) setLoading(false)
			}
		}

		load()
		return () => {
			active = false
		}
	}, [])

	const filteredTracks = useMemo(() => {
		if (!search) return tracks
		return tracks.filter(trackTitleFilter(search))
	}, [search, tracks])

	return {
		tracks: filteredTracks,
		loading,
		statusMessage,
		permissionDenied,
	}
}
