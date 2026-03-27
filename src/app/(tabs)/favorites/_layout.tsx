import { StackScreenWithSearchBar } from '@/constants/layout'
import { defaultStyle } from '@/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'

const FavoritesScreenLayout = () => {
	return (
		<View style={defaultStyle.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						...StackScreenWithSearchBar,
						headerTitle: 'Favorites',
					}}
				/>
			</Stack>
		</View>
	)
}

export default FavoritesScreenLayout
