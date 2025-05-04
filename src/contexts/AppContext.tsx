import { createContext, ReactNode, useContext, useState } from 'react'

interface AppContextProps {
  cha: boolean
}

const AppContext = createContext<AppContextProps | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [tags, setTags] = useState<>(null)

  return (
    <AppContext.Provider
      value={{
        tags
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppData = (): AppContextProps => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppData must be used within a AppProvider')
  }

  return context
}
