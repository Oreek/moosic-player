import { defaultStyle } from '@/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const SongScreenLayout = () => {
	return (
		<View style={defaultStyle.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerTitle: 'Songs',
					}}
				/>
			</Stack>
		</View>
	)
}

export default SongScreenLayout
