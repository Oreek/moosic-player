import { colors } from '@/constants/token'
import { useLibrary } from '@/context/LibraryProvider'
import { defaultStyle } from '@/styles'
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

const SettingsScreen = () => {
	const { loading, statusMessage, addFolder, cleanFolders } = useLibrary()

	return (
		<ScrollView contentInsetAdjustmentBehavior="automatic" style={defaultStyle.container}>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Music Folders</Text>
				<Text style={styles.sectionHint}>
					Choose folders on your device that contain audio files.
				</Text>
				<View style={styles.actionContainer}>
					<TouchableOpacity style={[styles.button, styles.addButton]} onPress={addFolder}>
						<Text style={styles.buttonText}>Add folder</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[styles.button, styles.clearButton]} onPress={cleanFolders}>
						<Text style={styles.buttonText}>Clear folders</Text>
					</TouchableOpacity>
				</View>
				{loading ? (
					<View style={styles.statusBlock}>
						<ActivityIndicator size="small" />
						<Text style={styles.statusText}>{statusMessage}</Text>
					</View>
				) : (
					<Text style={styles.statusText}>{statusMessage}</Text>
				)}
			</View>
		</ScrollView>
	)
}

export default SettingsScreen

const styles = StyleSheet.create({
	section: {
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 24,
	},
	sectionTitle: {
		...defaultStyle.text,
		fontSize: 18,
		fontWeight: '700',
		marginBottom: 8,
	},
	sectionHint: {
		...defaultStyle.text,
		opacity: 0.65,
		fontSize: 14,
		lineHeight: 20,
		marginBottom: 16,
	},
	actionContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		gap: 12,
		marginBottom: 16,
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 24,
		minWidth: 120,
		alignItems: 'center',
	},
	addButton: {
		backgroundColor: colors.primary,
		elevation: 2,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	clearButton: {
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.3)',
	},
	buttonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 14,
	},
	statusBlock: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		justifyContent: 'center',
	},
	statusText: {
		...defaultStyle.text,
		textAlign: 'center',
		opacity: 0.75,
		fontSize: 14,
		flex: 1,
	},
})
