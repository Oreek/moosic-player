import { unknownTrackImgUrl } from '@/constants/images'
import { colors, fontsize, screenPadding } from '@/constants/token'
import { useAudioPlayer } from '@/hooks/useAudioPlayer'
import { defaultStyle } from '@/styles'
import Slider from '@react-native-community/slider'
import { useRouter } from 'expo-router'
import { ChevronDown, Pause, Play, SkipBack, SkipForward } from 'lucide-react-native'
import { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function formatTime(seconds: number) {
	if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
	const m = Math.floor(seconds / 60)
	const s = Math.floor(seconds % 60)
	return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PlayerScreen() {
	const router = useRouter()
	const insets = useSafeAreaInsets()

	const {
		currentTrack,
		queue,
		currentIndex,
		isPlaying,
		currentTime,
		duration,
		isLoaded,
		isBuffering,
		togglePlayPause,
		seekTo,
		skipToNext,
		skipToPrevious,
		syncLockScreenMetadata,
	} = useAudioPlayer()

	const [scrubbing, setScrubbing] = useState(false)
	const [scrubValue, setScrubValue] = useState(0)

	const displayTime = scrubbing ? scrubValue : currentTime
	const maxDuration = duration > 0 ? duration : 1

	const artworkUri = currentTrack?.artwork ?? unknownTrackImgUrl

	const canGoNext = currentIndex < queue.length - 1

	const onSlidingComplete = useCallback(
		async (value: number) => {
			setScrubbing(false)
			await seekTo(value)
			syncLockScreenMetadata()
		},
		[seekTo, syncLockScreenMetadata],
	)

	const headerTop = useMemo(() => insets.top + 8, [insets.top])

	if (!currentTrack) {
		return (
			<View style={[styles.root, { paddingTop: headerTop }]}>
				<Pressable
					onPress={() => router.back()}
					style={[styles.iconButton, { marginLeft: screenPadding.horizontal }]}
					hitSlop={12}
				>
					<ChevronDown size={28} color={colors.text} />
				</Pressable>
				<View style={styles.emptyState}>
					<Text style={styles.emptyTitle}>Nothing playing</Text>
					<Text style={styles.emptySubtitle}>Choose a song from your library</Text>
				</View>
			</View>
		)
	}

	return (
		<View style={styles.root}>
			<View style={[styles.header, { paddingTop: headerTop }]}>
				<Pressable
					onPress={() => router.back()}
					style={[styles.iconButton, { marginLeft: screenPadding.horizontal }]}
					hitSlop={12}
				>
					<ChevronDown size={28} color={colors.text} />
				</Pressable>
				<Text style={styles.headerLabel} numberOfLines={1}>
					Now playing
				</Text>
				<View style={{ width: 44 }} />
			</View>
			<View style={styles.body}>
				<Image source={{ uri: artworkUri }} style={styles.artwork} />
				<View style={styles.meta}>
					<Text style={styles.title} numberOfLines={2}>
						{currentTrack.title}
					</Text>
					<Text style={styles.artist} numberOfLines={1}>
						{currentTrack.artist ?? 'Unknown artist'}
					</Text>
				</View>
				<View style={styles.progressBlock}>
					<Slider
						style={styles.slider}
						minimumValue={0}
						maximumValue={maxDuration}
						value={displayTime}
						onSlidingStart={() => {
							setScrubbing(true)
							setScrubValue(currentTime)
						}}
						onValueChange={setScrubValue}
						onSlidingComplete={onSlidingComplete}
						minimumTrackTintColor={colors.primary}
						maximumTrackTintColor={colors.maximumTrackTintColor}
						thumbTintColor={colors.text}
						disabled={!isLoaded && !isBuffering}
					/>
					<View style={styles.timeRow}>
						<Text style={styles.timeText}>{formatTime(displayTime)}</Text>
						<Text style={styles.timeText}>{formatTime(duration)}</Text>
					</View>
				</View>
				<View style={styles.controls}>
					<Pressable onPress={skipToPrevious} style={styles.controlButton} hitSlop={8}>
						<SkipBack size={32} color={colors.text} fill={colors.text} />
					</Pressable>
					<Pressable onPress={togglePlayPause} style={styles.playButton} hitSlop={8}>
						{isBuffering && !isPlaying ? (
							<ActivityIndicator color={colors.background} size="large" />
						) : isPlaying ? (
							<Pause size={36} color={colors.background} fill={colors.background} />
						) : (
							<Play
								size={36}
								color={colors.background}
								fill={colors.background}
								style={{ marginLeft: 4 }}
							/>
						)}
					</Pressable>
					<Pressable
						onPress={skipToNext}
						style={styles.controlButton}
						disabled={!canGoNext}
						hitSlop={8}
					>
						<SkipForward
							size={32}
							color={canGoNext ? colors.text : colors.textMuted}
							fill={canGoNext ? colors.text : colors.textMuted}
						/>
					</Pressable>
				</View>
				<Text style={styles.queueHint} numberOfLines={1}>
					{queue.length > 1 ? `Track ${currentIndex + 1} of ${queue.length}` : 'Single track queue'}
				</Text>
			</View>
			<View style={{ height: insets.bottom + 24 }} />
		</View>
	)
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 8,
		paddingBottom: 8,
	},
	headerLabel: {
		...defaultStyle.text,
		fontSize: fontsize.sm,
		fontWeight: '600',
		color: colors.textMuted,
		flex: 1,
		textAlign: 'center',
	},
	iconButton: {
		width: 44,
		height: 44,
		alignItems: 'center',
		justifyContent: 'center',
	},
	body: {
		flex: 1,
		paddingHorizontal: screenPadding.horizontal,
		paddingTop: 12,
	},
	artwork: {
		width: '100%',
		aspectRatio: 1,
		borderRadius: 12,
		backgroundColor: '#111',
	},
	meta: {
		marginTop: 28,
		alignItems: 'center',
	},
	title: {
		...defaultStyle.text,
		fontSize: fontsize.lg,
		fontWeight: '700',
		textAlign: 'center',
	},
	artist: {
		...defaultStyle.text,
		fontSize: fontsize.sm,
		color: colors.textMuted,
		marginTop: 8,
		textAlign: 'center',
	},
	progressBlock: {
		marginTop: 32,
	},
	slider: {
		width: '100%',
		height: 40,
	},
	timeRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: -4,
	},
	timeText: {
		...defaultStyle.text,
		fontSize: fontsize.xs,
		color: colors.textMuted,
	},
	controls: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 40,
		marginTop: 28,
	},
	controlButton: {
		width: 52,
		height: 52,
		alignItems: 'center',
		justifyContent: 'center',
	},
	playButton: {
		width: 72,
		height: 72,
		borderRadius: 36,
		backgroundColor: colors.primary,
		alignItems: 'center',
		justifyContent: 'center',
	},
	queueHint: {
		...defaultStyle.text,
		fontSize: fontsize.xs,
		color: colors.textMuted,
		textAlign: 'center',
		marginTop: 32,
	},
	emptyState: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 32,
	},
	emptyTitle: {
		...defaultStyle.text,
		fontSize: fontsize.lg,
		fontWeight: '600',
	},
	emptySubtitle: {
		...defaultStyle.text,
		fontSize: fontsize.sm,
		color: colors.textMuted,
		marginTop: 8,
		textAlign: 'center',
	},
})
