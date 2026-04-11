import { unknownTrackImgUrl } from '@/constants/images'
import { colors, fontsize } from '@/constants/token'
import { defaultStyle } from '@/styles'
import { ChevronRight } from 'lucide-react-native'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'

export type TrackListItenProps = {
	track: { title: string; image?: string; artist?: string }
	isActive?: boolean
	onPress?: () => void
}

export const TrackListItem = ({ track, isActive = false, onPress }: TrackListItenProps) => {
	return (
		<TouchableHighlight onPress={onPress} underlayColor={colors.background}>
			<View style={styles.trackItemContainer}>
				<Image
					source={{
						uri: track.image ?? unknownTrackImgUrl,
					}}
					style={{
						...styles.trackArtworkImg,
						opacity: isActive ? 0.6 : 1,
					}}
				/>

				<View style={styles.textContainer}>
					<Text
						numberOfLines={1}
						style={{
							...styles.trackTitleText,
							color: isActive ? colors.primary : colors.text,
						}}
					>
						{track.title}
					</Text>

					<Text numberOfLines={1} style={styles.trackArtistText}>
						{track.artist?.trim() || 'Unknown Artist'}
					</Text>
				</View>

				<ChevronRight
					size={20}
					color={isActive ? colors.primary : colors.textMuted}
					style={{ opacity: isActive ? 1 : 0.6 }}
				/>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	trackArtworkImg: {
		borderRadius: 8,
		width: 50,
		height: 50,
		marginRight: 12,
	},
	trackTitleText: {
		...defaultStyle.text,
		fontSize: fontsize.sm,
		fontWeight: '600',
		// maxWidth: '90%',
	},
	trackArtistText: {
		...defaultStyle.text,
		color: colors.textMuted,
		fontSize: 14,
		marginTop: 4,
	},
	trackItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 16,
	},
	textContainer: {
		flex: 1,
	},
})
