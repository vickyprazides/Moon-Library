import { createContext, useState, useContext, useEffect } from 'react'

/**
 * Context para gerenciar livros favoritos
 * Armazena os favoritos no localStorage
 */
const FavoritesContext = createContext()

/**
 * Provider para Favoritos
 */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  // Carregar favoritos do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('moonLibraryFavorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  // Salvar favoritos no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('moonLibraryFavorites', JSON.stringify(favorites))
  }, [favorites])

  /**
   * Adiciona um livro aos favoritos
   */
  const addFavorite = (book) => {
    const exists = favorites.some(fav => fav.id === book.id)
    if (!exists) {
      setFavorites([...favorites, book])
    }
  }

  /**
   * Remove um livro dos favoritos
   */
  const removeFavorite = (bookId) => {
    setFavorites(favorites.filter(fav => fav.id !== bookId))
  }

  /**
   * Verifica se um livro está nos favoritos
   */
  const isFavorite = (bookId) => {
    return favorites.some(fav => fav.id === bookId)
  }

  /**
   * Toggle para adicionar/remover dos favoritos
   */
  const toggleFavorite = (book) => {
    if (isFavorite(book.id)) {
      removeFavorite(book.id)
    } else {
      addFavorite(book)
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

/**
 * Hook para usar o context de favoritos
 */
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider')
  }
  return context
}
