import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { colors } from './token'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
	// headerLargeTitle: true,
	headerTitleAlign: 'left',
	// headerLargeStyle: {
	// 	backgroundColor: colors.background,
	// },
	// headerLargeTitleStyle: {
	// 	color: colors.text,
	// 	fontSize: 70,
	// 	fontWeight: 'bold',
	// },
	headerStyle: {
		backgroundColor: colors.background,
	},
	headerTitleStyle: {
		fontSize: 37,
		fontWeight: 'bold',
		color: colors.text,
	},
	headerTintColor: colors.text,
	// headerTransparent: true,
	// headerBlurEffect: 'prominent',
	headerShadowVisible: false,
}
