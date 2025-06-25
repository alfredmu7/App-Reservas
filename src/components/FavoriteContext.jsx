import React, { createContext, useState } from 'react'

export const FavoriteContext = createContext();

export const FavoriteProvider = ({children}) => {

    const [favorites, setFavorites] = useState([]);


  return (
    <FavoriteContext.Provider value={{favorites, setFavorites}}>
        {children}
    </FavoriteContext.Provider>
  )
}
