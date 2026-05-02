import { TracksList } from '@/components/TracksList'
import { colors } from '@/constants/token'
import { useFavorites } from '@/context/FavoritesProvider'
import { useLibrary } from '@/context/LibraryProvider'
import { trackOrArtistFilter } from '@/helpers/filter'
import type { AudioTrack } from '@/hooks/useAudioPlayer'
import { useNavSearch } from '@/hooks/useNavigationSearch'
import { defaultStyle } from '@/styles'
import { useMemo } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'

const FavoritesScreen = () => {
	const search = useNavSearch({
		searchBarOptions: {
			placeholder: 'Find in Favorites',
			disableBackButtonOverride: true,
		},
	})

	const { tracks: libraryTracks, loading, statusMessage } = useLibrary()
	const { favorites, hydrated } = useFavorites()

	const displayTracks = useMemo(() => {
		const byUrl = new Map(libraryTracks.map((t) => [t.url, t]))
		const merged: AudioTrack[] = favorites.map((f) => {
			const live = byUrl.get(f.url)
			return (
				live ?? {
					url: f.url,
					title: f.title,
					artist: f.artist,
					artwork: f.artwork,
				}
			)
		})
		if (!search) return merged
		return merged.filter(trackOrArtistFilter(search))
	}, [libraryTracks, favorites, search])

	const showSpinner = loading || !hydrated

	return (
		<View style={defaultStyle.container}>
			{showSpinner ? (
				<View style={{ padding: 16 }}>
					<ActivityIndicator size="large" />
					<Text style={{ marginTop: 8, textAlign: 'center', color: colors.text }}>
						{!hydrated ? 'Loading favorites' : statusMessage}
					</Text>
				</View>
			) : (
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					{favorites.length === 0 ? (
						<View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
							<Text style={[defaultStyle.text, { textAlign: 'center', opacity: 0.65 }]}>
								No favorites
							</Text>
						</View>
					) : displayTracks.length === 0 ? (
						<View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
							<Text style={[defaultStyle.text, { textAlign: 'center', opacity: 0.65 }]}>
								No matches of your search
							</Text>
						</View>
					) : (
						<TracksList tracks={displayTracks} scrollEnabled={false} showFavoriteToggle />
					)}
				</ScrollView>
			)}
		</View>
	)
}

export default FavoritesScreen
