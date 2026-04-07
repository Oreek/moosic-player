import { useAudioPlayer, type AudioTrack } from '@/hooks/useAudioPlayer'
import { defaultStyle } from '@/styles'
import { useRouter } from 'expo-router'
import { FlatList, FlatListProps, View } from 'react-native'
import { TrackListItem } from './TrackListItem'

export type TracksListProps = Partial<FlatListProps<AudioTrack>> & {
	tracks: AudioTrack[]
}

const ItemDivider = () => (
	<View style={{ ...defaultStyle.ItemSeparator, marginVertical: 9, marginLeft: 60 }} />
)

export const TracksList = ({ tracks, ...flatlistProps }: TracksListProps) => {
	const router = useRouter()
	const { currentTrack, playTrack } = useAudioPlayer()

	return (
		<FlatList
			data={tracks}
			renderItem={({ item: track }) => (
				<TrackListItem
					track={{
						...track,
						image: track.artwork,
					}}
					isActive={currentTrack?.url === track.url}
					onPress={() => {
						playTrack(track, { queue: tracks })
						router.push('/player')
					}}
				/>
			)}
			contentContainerStyle={{
				paddingBottom: 138,
				paddingTop: 20,
			}}
			ItemSeparatorComponent={ItemDivider}
			ListFooterComponent={ItemDivider}
			{...flatlistProps}
		/>
	)
}
