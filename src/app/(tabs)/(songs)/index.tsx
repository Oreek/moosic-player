import library from '@/assets/data/library.json'
import { TracksList } from '@/components/TracksList'
import { trackTitleFilter } from '@/helpers/filter'
import { useNavSearch } from '@/hooks/useNavigationSearch'
import { defaultStyle } from '@/styles'
import { useMemo } from 'react'
import { ScrollView, View } from 'react-native'

const SongScreen = () => {
	const search = useNavSearch({
		searchBarOptions: {
			placeholder: 'Find in Songs',
		},
	})

	const filteredSongs = useMemo(() => {
		if (!search) return library

		return library.filter(trackTitleFilter(search))
	}, [search])

	return (
		<View style={defaultStyle.container}>
			<ScrollView contentInsetAdjustmentBehavior="automatic">
				<TracksList tracks={filteredSongs} scrollEnabled={false} />
			</ScrollView>
		</View>
	)
}

export default SongScreen
