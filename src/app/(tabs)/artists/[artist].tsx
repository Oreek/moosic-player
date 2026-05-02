import { TracksList } from '@/components/TracksList'
import { useLibrary } from '@/context/LibraryProvider'
import { defaultStyle } from '@/styles'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import { useLayoutEffect, useMemo } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'

function artistLabel(track: { artist?: string }) {
	return track.artist?.trim() || 'Unknown Artist'
}

const ArtistDetailScreen = () => {
	const { artist: artistParam } = useLocalSearchParams<{ artist: string }>()
	const artistName = artistParam ? decodeURIComponent(artistParam) : ''
	const navigation = useNavigation()
	const { tracks, loading, statusMessage } = useLibrary()

	const artistTracks = useMemo(() => {
		return tracks
			.filter((t) => artistLabel(t) === artistName)
			.slice()
			.sort((a, b) => a.title.localeCompare(b.title))
	}, [tracks, artistName])

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: artistName || 'Artist',
		})
	}, [navigation, artistName])

	if (loading) {
		return (
			<View style={[defaultStyle.container, { padding: 24, alignItems: 'center' }]}>
				<ActivityIndicator size="large" />
				<Text style={[defaultStyle.text, { marginTop: 12, opacity: 0.7 }]}>{statusMessage}</Text>
			</View>
		)
	}

	return (
		<View style={defaultStyle.container}>
			{artistTracks.length === 0 ? (
				<View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
					<Text style={[defaultStyle.text, { textAlign: 'center', opacity: 0.65 }]}>
						No songs of this artist in your library
					</Text>
				</View>
			) : (
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					<TracksList tracks={artistTracks} scrollEnabled={false} showFavoriteToggle />
				</ScrollView>
			)}
		</View>
	)
}

export default ArtistDetailScreen
