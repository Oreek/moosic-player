import { TracksList } from '@/components/TracksList'
import { useLocalTracks } from '@/hooks/useLocalTracks'
import { useNavSearch } from '@/hooks/useNavigationSearch'
import { defaultStyle } from '@/styles'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'

const SongScreen = () => {
	const search = useNavSearch({
		searchBarOptions: {
			placeholder: 'Find in Songs',
			disableBackButtonOverride: true,
		},
	})

	const { tracks, loading, statusMessage } = useLocalTracks(search)
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
					<ActivityIndicator />
					<Text style={{ marginTop: 8 }}>{statusMessage}</Text>
				</View>
			) : (
				<ScrollView contentInsetAdjustmentBehavior="automatic">
					<View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
						<Text>{statusMessage}</Text>
					</View>
					<TracksList tracks={tracks} scrollEnabled={false} />
				</ScrollView>
			)}
		</View>
	)
}

export default SongScreen
