import unknownArtistImg from '@/assets/unknown_artist.png'
import unknownTrackImg from '@/assets/unknown_track.png'
import { Image } from 'react-native'

export const unknownTrackImgUrl = Image.resolveAssetSource(unknownTrackImg).uri
export const unknownArtistImgUrl = Image.resolveAssetSource(unknownArtistImg).uri
