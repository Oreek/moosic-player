import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { defaultStyle } from '../styles/index'

type HeaderButton = {
	child: React.ReactNode
	onPress?: () => void
}

type Props = {
	leftButton?: HeaderButton
	rightButton?: HeaderButton
}

export const Header = (props: Props) => {
	const { leftButton, rightButton } = props

	return (
		<View style={defaultStyle.container}>
			<View>
				{leftButton && (
					<TouchableOpacity onPress={leftButton.onPress}>{leftButton.child}</TouchableOpacity>
				)}
			</View>
			<View></View>
			<View>
				{rightButton && (
					<TouchableOpacity onPress={rightButton.onPress}>{rightButton.child}</TouchableOpacity>
				)}
			</View>
		</View>
	)
}
