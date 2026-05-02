export const trackTitleFilter = (title: string) => (track: { title?: string }) =>
	track.title?.toLowerCase().includes(title.toLowerCase())

export const trackOrArtistFilter =
	(query: string) => (track: { title?: string; artist?: string }) => {
		const q = query.toLowerCase()
		return !!track.title?.toLowerCase().includes(q) || !!track.artist?.toLowerCase().includes(q)
	}

export const artistNameFilter = (query: string) => (name: string) =>
	name.toLowerCase().includes(query.toLowerCase())
