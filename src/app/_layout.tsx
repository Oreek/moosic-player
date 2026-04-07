import { AudioPlayerProvider } from '@/hooks/useAudioPlayer'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = () => {
	return (
		<SafeAreaProvider>
			<AudioPlayerProvider>
				<RootNavigation />
				<StatusBar style="auto" />
			</AudioPlayerProvider>
		</SafeAreaProvider>
	)
}

const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="player"
				options={{
					presentation: 'modal',
					headerShown: false,
					animation: 'slide_from_bottom',
				}}
			/>
		</Stack>
	)
}

export default App
