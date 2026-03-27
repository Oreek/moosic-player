import { unknownTrackImgUrl } from '@/constants/images'
import { colors, fontsize } from '@/constants/token'
import { defaultStyle } from '@/styles'
import FastImage from '@d11/react-native-fast-image'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

export type TrackListItenProps = {
	track: { title: string; image?: string; artist?: string }
}

export const TrackListItem = ({ track }: TrackListItenProps) => {
	const isActiveTrack = false

	return (
		<TouchableHighlight>
			<View style={styles.trackItemContainer}>
				<View>
					<View>
						<FastImage
							source={{
								uri: track.image ?? unknownTrackImgUrl,
								priority: FastImage.priority.normal,
							}}
							style={{
								...styles.trackArtworkImg,
								opacity: isActiveTrack ? 0.6 : 1,
							}}
						/>
					</View>
					<View
						style={{
							width: '100%',
						}}
					>
						<Text
							numberOfLines={1}
							style={{
								...styles.trackTitleText,
								color: isActiveTrack ? colors.primary : colors.text,
							}}
						>
							{track.title}
						</Text>

						{track.artist && (
							<Text numberOfLines={1} style={styles.trackArtistText}>
								{track.artist}
							</Text>
						)}
					</View>
				</View>
			</View>
		</TouchableHighlight>
	)
}

const styles = StyleSheet.create({
	trackArtworkImg: {
		borderRadius: 8,
		width: 50,
		height: 50,
	},
	trackTitleText: {
		...defaultStyle.text,
		fontSize: fontsize.sm,
		fontWeight: '600',
		maxWidth: '90%',
	},
	trackArtistText: {
		...defaultStyle.text,
		color: colors.textMuted,
		fontSize: 14,
		marginTop: 4,
	},
	trackItemContainer: {
		flexDirection: 'row',
		columnGap: 14,
		alignItems: 'center',
		paddingRight: 20,
	},
})
