import type { AudioTrack } from '@/hooks/useAudioPlayer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

const FAVS_STORAGE_KEY = 'music_player_favorites'

export type FavoriteSnapshot = {
	url: string
	title: string
	artist?: string
	artwork?: string
}

type FavoriteContextValue = {
	favorites: FavoriteSnapshot[]
	isFavorite: (url: string) => boolean
	toggleFavorite: (track: AudioTrack) => void
	hydrated: boolean
}

const FavoriteContext = createContext<FavoriteContextValue | null>(null)

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
	const [entries, setEntries] = useState<FavoriteSnapshot[]>([])
	const [hydrated, setHydrated] = useState(false)

	useEffect(() => {
		let cancelled = false
		;(async () => {
			try {
				const raw = await AsyncStorage.getItem(FAVS_STORAGE_KEY)
				if (!cancelled) {
					setEntries(raw ? (JSON.parse(raw) as FavoriteSnapshot[]) : [])
				}
			} catch {
				if (!cancelled) setEntries([])
			} finally {
				if (!cancelled) setHydrated(true)
			}
		})()
		return () => {
			cancelled = true
		}
	}, [])

	useEffect(() => {
		if (!hydrated) return
		void AsyncStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify(entries))
	}, [entries, hydrated])

	const isFavorite = useCallback((url: string) => entries.some((e) => e.url === url), [entries])

	const toggleFavorite = useCallback((track: AudioTrack) => {
		setEntries((prev) => {
			const exists = prev.some((e) => e.url === track.url)
			if (exists) {
				return prev.filter((e) => e.url !== track.url)
			}
			return [
				...prev,
				{
					url: track.url,
					title: track.title,
					artist: track.artist,
					artwork: track.artwork,
				},
			]
		})
	}, [])

	const value = useMemo(
		() => ({
			favorites: entries,
			isFavorite,
			toggleFavorite,
			hydrated,
		}),
		[entries, isFavorite, toggleFavorite, hydrated],
	)

	return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>
}

export const useFavorites = () => {
	const ctx = useContext(FavoriteContext)
	if (!ctx) {
		throw new Error('must use useFavorites inside FavoritesProvider')
	}
	return ctx
}
