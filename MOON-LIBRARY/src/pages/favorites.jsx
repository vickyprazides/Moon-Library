import { Link } from 'react-router-dom'
import { useFavorites } from '../contexts/FavoritesContext'
import '../styles/Favorites.css'

/**
 * Página de Favoritos
 * Exibe todos os livros favoritados pelo usuário
 */
function Favorites() {
  const { favorites, removeFavorite } = useFavorites()

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return `https://via.placeholder.com/128x196/9c27b0/ffffff?text=Livro`
    
    let url = imageUrl;
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://')
    }
    
    return url
  }

  return (
    <div className="favorites-page">
      {/* Cabeçalho */}
      <header className="favorites-header">
        <Link to="/" className="back-link">
          ← Voltar à Home
        </Link>
        <h1>Meus Livros Favoritos</h1>
      </header>

      {/* Conteúdo */}
      <main className="favorites-content">
        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <p className="empty-message">
              Você ainda não tem livros favoritos 📚
            </p>
            <p className="empty-subtext">
              Busque por livros e adicione aos seus favoritos!
            </p>
            <Link to="/" className="empty-action">
              Buscar Livros
            </Link>
          </div>
        ) : (
          <>
            <p className="favorites-count">
              Você tem {favorites.length} livro{favorites.length !== 1 ? 's' : ''} favorito{favorites.length !== 1 ? 's' : ''}
            </p>

            <div className="favorites-grid">
              {favorites.map((book) => (
                <div key={book.id} className="favorite-card">
                  <Link to={`/produto/${book.id}`} className="favorite-card-link">
                    <img
                      src={getImageUrl(book.image)}
                      alt={book.title}
                      className="favorite-book-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/128x196?text=Sem+imagem'
                      }}
                    />
                    <div className="favorite-card-info">
                      <h3 className="favorite-book-title">{book.title}</h3>
                      <p className="favorite-book-author">
                        {book.authors.join(', ')}
                      </p>
                    </div>
                  </Link>

                  <button
                    className="remove-favorite-btn"
                    onClick={() => removeFavorite(book.id)}
                    title="Remover dos favoritos"
                    aria-label={`Remover ${book.title} dos favoritos`}
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Favorites
