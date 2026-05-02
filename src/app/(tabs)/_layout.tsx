import { MiniPlayer } from '@/components/MiniPlayer'
import { colors, fontsize } from '@/constants/token'
import { FavoriteProvider } from '@/context/FavoritesProvider'
import { LibraryProvider } from '@/context/LibraryProvider'
import { BlurTargetView, BlurView } from 'expo-blur'
import { Tabs } from 'expo-router'
import { Book, CircleUser, Heart, Music } from 'lucide-react-native'
import { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TabsNavigation = () => {
	const insets = useSafeAreaInsets()
	const blurRef = useRef<View | null>(null)
	const tabBarHeight = insets.bottom + 70

	return (
		<LibraryProvider>
			<FavoriteProvider>
				<BlurTargetView ref={blurRef} style={{ flex: 1 }}>
					<MiniPlayer bottomOffset={tabBarHeight + 4} />
					<Tabs
						screenOptions={{
							tabBarActiveTintColor: colors.primary,
							tabBarLabelStyle: {
								fontSize: fontsize.xs,
								fontWeight: '500',
							},
							headerShown: false,
							tabBarStyle: {
								position: 'absolute',
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
								borderTopWidth: 0,
								paddingTop: 8,
								paddingBottom: insets.bottom + 7,
								height: insets.bottom + 70,
								backgroundColor: 'transparent',
							},
							tabBarBackground: () => (
								<BlurView
									blurTarget={blurRef}
									intensity={95}
									blurMethod="dimezisBlurView"
									style={{
										...StyleSheet.absoluteFill,
										overflow: 'hidden',
										borderTopLeftRadius: 20,
										borderTopRightRadius: 20,
									}}
								/>
							),
						}}
					>
						<Tabs.Screen
							name="favorites"
							options={{
								title: 'Favorites',
								tabBarIcon: ({ color }) => <Heart size={20} color={color} />,
							}}
						/>
						<Tabs.Screen
							name="(songs)"
							options={{
								title: 'Songs',
								tabBarIcon: ({ color }) => <Music size={20} color={color} />,
							}}
						/>
						<Tabs.Screen
							name="artists"
							options={{
								title: 'Artists',
								tabBarIcon: ({ color }) => <CircleUser size={20} color={color} />,
							}}
						/>
						<Tabs.Screen
							name="settings"
							options={{
								title: 'Settings',
								tabBarIcon: ({ color }) => <Book size={20} color={color} />,
							}}
						/>
					</Tabs>
				</BlurTargetView>
			</FavoriteProvider>
		</LibraryProvider>
	)
}

export default TabsNavigation
