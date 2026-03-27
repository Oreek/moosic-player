import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { colors } from './token'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
	headerLargeTitle: true,
	headerTitleAlign: 'center',
	headerLargeStyle: {
		backgroundColor: colors.background,
	},
	headerLargeTitleStyle: {
		color: colors.text,
		fontSize: 70,
		fontWeight: 'bold',
	},
	headerTintColor: colors.text,
	headerTransparent: true,
	headerBlurEffect: 'prominent',
	headerShadowVisible: false,
}
