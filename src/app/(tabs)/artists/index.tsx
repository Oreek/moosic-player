import { colors, fontsize } from '@/constants/token'
import { useLibrary } from '@/context/LibraryProvider'
import { artistNameFilter } from '@/helpers/filter'
import { useNavSearch } from '@/hooks/useNavigationSearch'
import { defaultStyle } from '@/styles'
import { useRouter } from 'expo-router'
import { ChevronRight, CircleUser } from 'lucide-react-native'
import { useMemo } from 'react'
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from 'react-native'

type ArtistRow = { name: string; trackCount: number }

function artistLabel(track: { artist?: string }) {
	return track.artist?.trim() || 'Unknown artist'
}

const ArtistsScreen = () => {
	const search = useNavSearch({
		searchBarOptions: {
			placeholder: 'Find artists',
			disableBackButtonOverride: true,
		},
	})

	const { tracks, loading, statusMessage } = useLibrary()
	const router = useRouter()

	const artistRows = useMemo(() => {
		const counts = new Map<string, number>()
		for (const t of tracks) {
			const name = artistLabel(t)
			counts.set(name, (counts.get(name) ?? 0) + 1)
		}
		const rows: ArtistRow[] = [...counts.entries()].map(([name, trackCount]) => ({
			name,
			trackCount,
		}))
		rows.sort((a, b) => a.name.localeCompare(b.name))
		if (!search) return rows
		const filter = artistNameFilter(search)
		return rows.filter((r) => filter(r.name))
	}, [tracks, search])

	if (loading) {
		return (
			<View style={[defaultStyle.container, styles.centered]}>
				<ActivityIndicator size="large" />
				<Text style={[defaultStyle.text, styles.status]}>{statusMessage}</Text>
			</View>
		)
	}

	return (
		<View style={defaultStyle.container}>
			{tracks.length === 0 ? (
				<View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
					<Text style={[defaultStyle.text, { textAlign: 'center', opacity: 0.65 }]}>
						{statusMessage}
					</Text>
				</View>
			) : artistRows.length === 0 ? (
				<View style={{ paddingHorizontal: 24, paddingTop: 24 }}>
					<Text style={[defaultStyle.text, { textAlign: 'center', opacity: 0.65 }]}>
						No artists in search filter
					</Text>
				</View>
			) : (
				<FlatList
					data={artistRows}
					keyExtractor={(item) => item.name}
					contentContainerStyle={{
						paddingBottom: 138,
						paddingTop: 20,
					}}
					ItemSeparatorComponent={() => (
						<View style={{ ...defaultStyle.ItemSeparator, marginVertical: 9, marginLeft: 60 }} />
					)}
					renderItem={({ item }) => (
						<TouchableHighlight
							onPress={() => {
								router.push(`/artists/${encodeURIComponent(item.name)}`)
							}}
							underlayColor={colors.background}
						>
							<View style={styles.row}>
								<View style={styles.avatar}>
									<CircleUser size={28} color={colors.textMuted} />
								</View>
								<View style={styles.textBlock}>
									<Text style={styles.name} numberOfLines={1}>
										{item.name}
									</Text>
									<Text style={styles.sub} numberOfLines={1}>
										{item.trackCount} {item.trackCount === 1 ? 'song' : 'songs'}
									</Text>
								</View>
								<ChevronRight size={20} color={colors.textMuted} />
							</View>
						</TouchableHighlight>
					)}
				/>
			)}
		</View>
	)
}

export default ArtistsScreen

const styles = StyleSheet.create({
	centered: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},
	status: {
		marginTop: 12,
		textAlign: 'center',
		opacity: 0.7,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 16,
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 8,
		marginRight: 12,
		backgroundColor: 'rgba(255,255,255,0.06)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	textBlock: {
		flex: 1,
		minWidth: 0,
	},
	name: {
		...defaultStyle.text,
		fontSize: fontsize.sm,
		fontWeight: '600',
	},
	sub: {
		...defaultStyle.text,
		color: colors.textMuted,
		fontSize: 14,
		marginTop: 4,
	},
})
