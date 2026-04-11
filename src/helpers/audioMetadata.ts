import { getAudioMetadata } from '@missingcore/audio-metadata'
import * as FileSystem from 'expo-file-system/legacy'

const METADATA_CACHE_DIR = `${FileSystem.cacheDirectory}audio-metadata/`
const ARTWORK_CACHE_DIR = `${FileSystem.cacheDirectory}lock-artwork/`

const METADATA_EXTENSIONS = new Set(['mp3', 'flac', 'm4a', 'mp4'])

const WANTED_TAGS = ['artist', 'albumArtist', 'name', 'artwork'] as const

function inferFromFilenameStem(stem: string): { artist?: string; title?: string } {
	const s = stem.trim()
	if (!s) return {}

	const normalized = s.replace(/\s+[\u2013\u2014\u2212]\s+/g, ' - ').trim()
	const parts = normalized.split(/\s+-\s+/)
	if (parts.length < 2) return {}

	const rawLeft = parts[0].trim()
	const right = parts.slice(1).join(' - ').trim()
	const left = rawLeft.replace(/^\d{1,3}\s*[\.\)]?\s+/, '').trim() || rawLeft.trim()

	if (left.length < 1 || right.length < 1) return {}
	return { artist: left, title: right }
}

function metaArtist(m: { artist?: string; albumArtist?: string }): string | undefined {
	const a = m.artist?.trim()
	if (a) return a

	const aa = m.albumArtist?.trim()
	if (aa) return aa

	return undefined
}

function extensionFromUri(uri: string): string | null {
	try {
		const decoded = decodeURIComponent(uri)
		const match = decoded.match(/\.([a-z0-9]+)$/i)
		return match ? match[1].toLowerCase() : null
	} catch {
		return null
	}
}

function uriCacheKey(uri: string): string {
	let h = 5381
	for (let i = 0; i < uri.length; i++) {
		h = (h * 33) ^ uri.charCodeAt(i)
	}
	return (h >>> 0).toString(36)
}

function imageExtFromMime(mime: string): string {
	const m = mime.toLowerCase()
	if (m.includes('png')) return 'png'
	if (m.includes('webp')) return 'webp'
	if (m.includes('gif')) return 'gif'
	return 'jpg'
}

async function persistDataArtworkToCache(
	dataArtwork: string,
	stableKey: string,
): Promise<string | undefined> {
	const match = /^data:([^;]+);base64,([\s\S]+)$/i.exec(dataArtwork.trim())
	if (!match) return undefined
	const ext = imageExtFromMime(match[1])
	const b64 = match[2].replace(/\s/g, '')
	const dest = `${ARTWORK_CACHE_DIR}${uriCacheKey(stableKey)}.${ext}`

	try {
		const existing = await FileSystem.getInfoAsync(dest, { size: true })
		if (existing.exists && !existing.isDirectory && (existing.size ?? 0) > 0) {
			return dest
		}
		if (existing.exists) {
			await FileSystem.deleteAsync(dest, { idempotent: true })
		}

		await FileSystem.makeDirectoryAsync(ARTWORK_CACHE_DIR, { intermediates: true })
		await FileSystem.writeAsStringAsync(dest, b64, {
			encoding: FileSystem.EncodingType.Base64,
		})
		return dest
	} catch {
		return undefined
	}
}

async function artworkUriForApp(
	artwork: string | undefined,
	stableKey: string,
): Promise<string | undefined> {
	if (!artwork?.trim()) return undefined
	const a = artwork.trim()
	if (a.startsWith('data:')) {
		return persistDataArtworkToCache(a, stableKey)
	}
	return a
}

async function uriForMetadataReading(sourceUri: string, ext: string): Promise<string> {
	if (sourceUri.startsWith('file://')) {
		return sourceUri
	}
	const dest = `${METADATA_CACHE_DIR}${uriCacheKey(sourceUri)}.${ext}`
	const existing = await FileSystem.getInfoAsync(dest, { size: true })

	if (existing.exists && !existing.isDirectory && (existing.size ?? 0) > 0) {
		return dest
	}
	if (existing.exists) {
		await FileSystem.deleteAsync(dest, { idempotent: true })
	}

	await FileSystem.makeDirectoryAsync(METADATA_CACHE_DIR, { intermediates: true })
	await FileSystem.copyAsync({ from: sourceUri, to: dest })
	return dest
}

export async function readLocalAudioMetadata(
	fileUri: string,
	fallbackTitle: string,
): Promise<{ title: string; artist: string; artwork?: string }> {
	const ext = extensionFromUri(fileUri)
	if (!ext || !METADATA_EXTENSIONS.has(ext)) {
		return { title: fallbackTitle, artist: 'Unknown Artist', artwork: undefined }
	}

	try {
		const readUri = await uriForMetadataReading(fileUri, ext)
		const data = await getAudioMetadata(readUri, [...WANTED_TAGS])
		const m = data.metadata
		const inferred = inferFromFilenameStem(fallbackTitle)

		const taggedTitle = m.name?.trim()
		const taggedArtist = metaArtist(m)
		const inferredTitle = inferred.title?.trim()
		const inferredArtist = inferred.artist?.trim()

		const title = taggedTitle || inferredTitle || fallbackTitle

		let artist = taggedArtist
		if (!artist && inferredArtist) {
			const it = inferredTitle?.toLowerCase()
			const tt = taggedTitle?.toLowerCase()
			if (!taggedTitle || (it && tt && it === tt)) {
				artist = inferredArtist
			}
		}
		if (!artist) artist = 'Unknown Artist'

		const artwork = await artworkUriForApp(m.artwork?.trim(), fileUri)
		return {
			title,
			artist,
			...(artwork ? { artwork } : {}),
		}
	} catch {
		return { title: fallbackTitle, artist: 'Unknown Artist', artwork: undefined }
	}
}

export async function mapWithConcurrency<T, R>(
	items: readonly T[],
	concurrency: number,
	fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
	if (items.length === 0) return []
	const results = new Array<R>(items.length)
	let next = 0

	const worker = async () => {
		for (;;) {
			const i = next++
			if (i >= items.length) break
			results[i] = await fn(items[i], i)
		}
	}

	const n = Math.min(Math.max(1, concurrency), items.length)
	await Promise.all(Array.from({ length: n }, () => worker()))
	return results
}
