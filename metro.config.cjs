const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

config.resolver.resolveRequest = (context, moduleName, platform) => {
	const origin = context.originModulePath.replace(/\\/g, '/')
	if (
		moduleName === 'expo-file-system' &&
		origin.includes('node_modules/@missingcore/audio-metadata')
	) {
		return context.resolveRequest(context, 'expo-file-system/legacy', platform)
	}
	return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
