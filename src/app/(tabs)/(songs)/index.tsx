import { TracksList } from '@/components/TracksList'
import { colors } from '@/constants/token'
import { useLibrary } from '@/context/LibraryProvider'
import { trackTitleFilter } from '@/helpers/filter'
import { useNavSearch } from '@/hooks/useNavigationSearch'
import { defaultStyle } from '@/styles'
import { useMemo } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'

const SongScreen = () => {
	const search = useNavSearch({
		searchBarOptions: {
			placeholder: 'Find in Songs',
			disableBackButtonOverride: true,
		},
	})

	const { tracks: libraryTracks, loading, statusMessage } = useLibrary()

	const tracks = useMemo(() => {
		if (!search) {
			return libraryTracks
		}
		return libraryTracks.filter(trackTitleFilter(search))
	}, [search, libraryTracks])
	// const filteredSongs = useMemo(() => {
	// 	if (!search) return library

	// 	return library.filter(trackTitleFilter(search))
	// }, [search])

	// return (
	// 	<View style={defaultStyle.container}>
	// 		<ScrollView contentInsetAdjustmentBehavior="automatic">
	// 			<TracksList tracks={filteredSongs} scrollEnabled={false} />
	// 		</ScrollView>
	// 	</View>
	// )

	return (
		<View style={defaultStyle.container}>
			{loading ? (
				<View style={{ padding: 16 }}>
					<ActivityIndicator size="large" />
					<Text style={{ marginTop: 8, textAlign: 'center' }}>{statusMessage}</Text>
				</View>
			) : (
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					<View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
						<Text style={[defaultStyle.text, { textAlign: 'center', opacity: 0.65 }]}>
							{statusMessage}
						</Text>
					</View>
					<TracksList tracks={tracks} scrollEnabled={false} showFavoriteToggle />
				</ScrollView>
			)}
		</View>
	)
}

export default SongScreen

const styles = StyleSheet.create({
	actionContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 8,
		gap: 12,
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 24,
		minWidth: 120,
		alignItems: 'center',
	},
	addButton: {
		backgroundColor: colors.primary,
		elevation: 2,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	clearButton: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.3)',
	},
	buttonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 14,
	},
})
