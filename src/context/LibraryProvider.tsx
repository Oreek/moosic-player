import { useLocalTracks } from '@/hooks/useLocalTracks'
import { createContext, type ReactNode, useContext } from 'react'

type LibraryContextValue = ReturnType<typeof useLocalTracks>

const LibraryContext = createContext<LibraryContextValue | null>(null)

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
	const value = useLocalTracks()
	return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export const useLibrary = () => {
	const ctx = useContext(LibraryContext)
	if (!ctx) {
		throw new Error('must use useLirary inside LibraryProvider')
	}
	return ctx
}
