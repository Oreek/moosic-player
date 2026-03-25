import { StyleSheet } from 'react-native'
import { colors, fontsize } from 'src/constants/token'

export const defaultStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	text: {
		fontSize: fontsize.base,
		color: colors.text,
	},
})

export const utilStyles = StyleSheet.create({})
