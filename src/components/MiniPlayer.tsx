import { unknownTrackImgUrl } from '@/constants/images'
import { colors, fontsize } from '@/constants/token'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { defaultStyle } from '@/styles'
import { useRouter } from 'expo-router'
import { Pause, Play, SkipForward } from 'lucide-react-native'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'

type MiniPlayerProps = {
	bottomOffset?: number
}

export const MiniPlayer = ({ bottomOffset = 0 }: MiniPlayerProps) => {
	const router = useRouter()
	const {
		currentTrack,
		queue,
		currentIndex,
		isPlaying,
		isBuffering,
		currentTime,
		duration,
		togglePlayPause,
		skipToNext,
	} = useAudioPlayer()

	if (!currentTrack) return null

	const canGoNext = currentIndex < queue.length - 1
	const progress = duration > 0 ? currentTime / duration : 0

	return (
		<View style={[styles.wrapper, { bottom: bottomOffset }]}>
			<View style={styles.progressBarTrack}>
				<View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
			</View>

			<Pressable
				style={styles.container}
				onPress={() => router.push('/player')}
				android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
			>
				<Image
					source={{ uri: currentTrack.artwork ?? unknownTrackImgUrl }}
					style={styles.artwork}
				/>

				<View style={styles.info}>
					<Text style={styles.title} numberOfLines={1}>
						{currentTrack.title}
					</Text>
					<Text style={styles.artist} numberOfLines={1}>
						{currentTrack.artist ?? 'Unknown artist'}
					</Text>
				</View>

				<View style={styles.controls}>
					<Pressable onPress={togglePlayPause} style={styles.controlBtn} hitSlop={8}>
						{isBuffering && !isPlaying ? (
							<ActivityIndicator color={colors.text} size="small" />
						) : isPlaying ? (
							<Pause size={22} color={colors.text} fill={colors.text} />
						) : (
							<Play size={22} color={colors.text} fill={colors.text} style={{ marginLeft: 2 }} />
						)}
					</Pressable>

					<Pressable
						onPress={skipToNext}
						style={styles.controlBtn}
						disabled={!canGoNext}
						hitSlop={8}
					>
						<SkipForward
							size={20}
							color={canGoNext ? colors.text : colors.textMuted}
							fill={canGoNext ? colors.text : colors.textMuted}
						/>
					</Pressable>
				</View>
			</Pressable>
		</View>
	)
}

const MINI_PLAYER_HEIGHT = 56

const styles = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		left: 8,
		right: 8,
		height: MINI_PLAYER_HEIGHT + 2, // +2 for progress bar
		zIndex: 10,
		borderRadius: 12,
		overflow: 'hidden',
		backgroundColor: '#1c1c1e',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	progressBarTrack: {
		height: 2,
		backgroundColor: 'rgba(255,255,255,0.1)',
		width: '100%',
	},
	progressBarFill: {
		height: '100%',
		backgroundColor: colors.primary,
		borderRadius: 1,
	},
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		gap: 10,
	},
	artwork: {
		width: 40,
		height: 40,
		borderRadius: 6,
		backgroundColor: '#111',
	},
	info: {
		flex: 1,
		justifyContent: 'center',
	},
	title: {
		...defaultStyle.text,
		fontSize: fontsize.sm - 2,
		fontWeight: '600',
	},
	artist: {
		...defaultStyle.text,
		fontSize: fontsize.xs,
		color: colors.textMuted,
		marginTop: 2,
	},
	controls: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	controlBtn: {
		width: 36,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
	},
})
