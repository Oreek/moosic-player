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
	ItemSeparator: {
		borderColor: colors.textMuted,
		borderWidth: StyleSheet.hairlineWidth,
		opacity: 0.3,
	},
})

export const utilStyles = StyleSheet.create({})
