import {
	type AudioMetadata,
	type AudioPlayer,
	type AudioStatus,
	createAudioPlayer,
	requestNotificationPermissionsAsync,
	setAudioModeAsync,
} from 'expo-audio'
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'

import { Platform } from 'react-native'

export type AudioTrack = {
	url: string
	title: string
	artist?: string
	artwork?: string
}

type PlayTrackOptions = {
	queue?: AudioTrack[]
}

type AudioPlayerContextValue = {
	currentTrack: AudioTrack | null
	queue: AudioTrack[]
	currentIndex: number
	isPlaying: boolean
	currentTime: number
	duration: number
	isLoaded: boolean
	isBuffering: boolean
	playTrack: (track: AudioTrack, options?: PlayTrackOptions) => void
	togglePlayPause: () => void
	pause: () => void
	resume: () => void
	seekTo: (seconds: number) => Promise<void>
	skipToNext: () => void
	skipToPrevious: () => void
	syncLockScreenMetadata: () => void
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null)

function lockScreenArtworkUrl(artwork: string | undefined): string | undefined {
	if (!artwork?.trim()) return undefined
	const u = artwork.trim()
	if (u.startsWith('data:')) return undefined
	return u
}

function lockScreenMeta(track: AudioTrack): AudioMetadata {
	return {
		title: track.title,
		artist: track.artist ?? 'Unknown artist',
		albumTitle: 'Moosic Player',
		artworkUrl: lockScreenArtworkUrl(track.artwork),
	}
}

const LOCK_OPTS = { showSeekForward: true, showSeekBackward: true } as const

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
	const playerRef = useRef<AudioPlayer | null>(null)
	const queueRef = useRef<AudioTrack[]>([])
	const indexRef = useRef(0)

	const [queue, setQueue] = useState<AudioTrack[]>([])
	const [currentIndex, setCurrentIndex] = useState(0)
	const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [isLoaded, setIsLoaded] = useState(false)
	const [isBuffering, setIsBuffering] = useState(false)

	const applyLockScreen = useCallback((track: AudioTrack, active: boolean) => {
		const p = playerRef.current
		if (!p) return
		if (active) {
			p.setActiveForLockScreen(true, lockScreenMeta(track), LOCK_OPTS)
		} else {
			p.setActiveForLockScreen(false)
		}
	}, [])

	const loadTrackAt = useCallback(
		(index: number, shouldPlay: boolean) => {
			const p = playerRef.current
			const q = queueRef.current
			if (!p || index < 0 || index >= q.length) return

			const track = q[index]
			indexRef.current = index
			setCurrentIndex(index)
			setCurrentTrack(track)

			p.replace({ uri: track.url, name: track.title })
			applyLockScreen(track, true)
			if (shouldPlay) {
				p.play()
			} else {
				p.pause()
			}
		},
		[applyLockScreen],
	)

	useEffect(() => {
		void setAudioModeAsync({
			playsInSilentMode: true,
			shouldPlayInBackground: true,
			interruptionMode: 'doNotMix',
			allowsRecording: false,
		})

		if (Platform.OS === 'android') {
			void requestNotificationPermissionsAsync()
		}

		const player = createAudioPlayer(null, { updateInterval: 250 })
		playerRef.current = player

		const sub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
			setIsPlaying(status.playing)
			setCurrentTime(status.currentTime)
			setDuration(status.duration)
			setIsLoaded(status.isLoaded)
			setIsBuffering(status.isBuffering)

			if (status.didJustFinish) {
				const q = queueRef.current
				const idx = indexRef.current
				if (idx >= 0 && idx < q.length - 1) {
					const next = idx + 1
					const t = q[next]
					indexRef.current = next
					setCurrentIndex(next)
					setCurrentTrack(t)
					player.replace({ uri: t.url, name: t.title })
					player.setActiveForLockScreen(true, lockScreenMeta(t), LOCK_OPTS)
					player.play()
				} else {
					player.setActiveForLockScreen(false)
					setIsPlaying(false)
				}
			}
		})

		return () => {
			sub.remove()
			player.setActiveForLockScreen(false)
			player.remove()
			playerRef.current = null
		}
	}, [])

	const playTrack = useCallback(
		(track: AudioTrack, options?: PlayTrackOptions) => {
			const p = playerRef.current
			if (!p) return

			const nextQueue = options?.queue?.length ? options.queue : [track]
			const resolvedIndex = Math.max(
				0,
				nextQueue.findIndex((t) => t.url === track.url),
			)

			queueRef.current = nextQueue
			setQueue(nextQueue)

			if (currentTrack?.url === track.url) {
				indexRef.current = resolvedIndex
				setCurrentIndex(resolvedIndex)
				if (p.playing) {
					p.pause()
				} else {
					applyLockScreen(track, true)
					p.play()
				}
				return
			}

			loadTrackAt(resolvedIndex, true)
		},
		[currentTrack?.url, loadTrackAt, applyLockScreen],
	)

	const togglePlayPause = useCallback(() => {
		const p = playerRef.current
		if (!p || !currentTrack) return
		if (p.playing) {
			p.pause()
		} else {
			applyLockScreen(currentTrack, true)
			p.play()
		}
	}, [currentTrack, applyLockScreen])

	const pause = useCallback(() => {
		playerRef.current?.pause()
	}, [])

	const resume = useCallback(() => {
		const p = playerRef.current
		if (!p || !currentTrack) return
		applyLockScreen(currentTrack, true)
		p.play()
	}, [currentTrack, applyLockScreen])

	const seekTo = useCallback(async (seconds: number) => {
		const p = playerRef.current
		const t = queueRef.current[indexRef.current]
		if (!p || !t) return
		await p.seekTo(seconds)
		p.updateLockScreenMetadata(lockScreenMeta(t))
	}, [])

	const skipToNext = useCallback(() => {
		const idx = indexRef.current
		if (idx < queueRef.current.length - 1) {
			loadTrackAt(idx + 1, true)
		}
	}, [loadTrackAt])

	const skipToPrevious = useCallback(() => {
		const p = playerRef.current
		if (!p) return

		const q = queueRef.current
		const idx = indexRef.current
		const t = q[idx]
		if (!t) return

		if (p.currentTime > 3) {
			void p.seekTo(0)
			p.updateLockScreenMetadata(lockScreenMeta(t))
			return
		}

		if (idx > 0) {
			loadTrackAt(idx - 1, true)
		} else {
			void p.seekTo(0)
			p.updateLockScreenMetadata(lockScreenMeta(t))
		}
	}, [loadTrackAt])

	const syncLockScreenMetadata = useCallback(() => {
		const p = playerRef.current
		const t = queueRef.current[indexRef.current]
		if (!p || !t) return
		p.updateLockScreenMetadata(lockScreenMeta(t))
	}, [])

	const value = useMemo(
		() => ({
			currentTrack,
			queue,
			currentIndex,
			isPlaying,
			currentTime,
			duration,
			isLoaded,
			isBuffering,
			playTrack,
			togglePlayPause,
			pause,
			resume,
			seekTo,
			skipToNext,
			skipToPrevious,
			syncLockScreenMetadata,
		}),
		[
			currentTrack,
			queue,
			currentIndex,
			isPlaying,
			currentTime,
			duration,
			isLoaded,
			isBuffering,
			playTrack,
			togglePlayPause,
			pause,
			resume,
			seekTo,
			skipToNext,
			skipToPrevious,
			syncLockScreenMetadata,
		],
	)

	return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
}

export const useAudioPlayer = () => {
	const context = useContext(AudioPlayerContext)
	if (!context) {
		throw new Error('useAudioPlayer must be used inside AudioPlayerProvider')
	}
	return context
}
