import { useState, useEffect } from 'react'
import '../styles/Home.css'
import { Link } from "react-router-dom"
import { useFavorites } from '../contexts/FavoritesContext'

/**
 * Componente Home - Tela principal do site de livros
 * Utiliza a Google Books API para buscar livros por título ou autor
 */
function Home() {
  // Estado para armazenar a query de busca
  const [searchQuery, setSearchQuery] = useState('')
  // controlar se a logo carregou corretamente
  const [logoError, setLogoError] = useState(false)

  // Estado para armazenar os livros retornados pela API
  const [books, setBooks] = useState([])

  // Estado para controlar o carregamento
  const [loading, setLoading] = useState(false)

  // Estado para armazenar mensagens de erro
  const [error, setError] = useState('')

  // Usar o context de favoritos
  const { isFavorite, toggleFavorite } = useFavorites()

  // Constante com a URL base da Google Books API
  const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

  /**
   * Carrega livros sugeridos ao montar o componente
   */
  useEffect(() => {
    const loadSuggestedBooks = async () => {
      try {
        setLoading(true)
        // Buscar livros populares de ficção
        const url = `${API_BASE_URL}?q=fiction&maxResults=12&startIndex=0&orderBy=relevance`
        const response = await fetch(url)
        
        if (response.ok) {
          const data = await response.json()
          if (data.items && data.items.length > 0) {
            setBooks(data.items)
          }
        }
      } catch (err) {
        console.error('Erro ao carregar sugestões:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSuggestedBooks()
  }, [])

  /**
   * Função para buscar livros na API
   * @param {string} query - Texto de busca (título ou autor)
   */
  const handleSearch = async (query) => {
    // Validação: evita buscar se a query está vazia
    if (!query.trim()) {
      setError('Por favor, digite um título ou autor para buscar')
      setBooks([])
      return
    }

    try {
      setLoading(true)
      setError('')

      // Construir URL com parâmetros de busca
      const url = `${API_BASE_URL}?q=${encodeURIComponent(query)}&maxResults=12&startIndex=0`

      // Fazer requisição à API
      const response = await fetch(url)

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error('Erro ao buscar livros. Tente novamente.')
      }

      const data = await response.json()

      // Verificar se obteve resultados
      if (data.items && data.items.length > 0) {
        setBooks(data.items)
      } else {
        setError('Nenhum livro encontrado. Tente outra busca.')
        setBooks([])
      }
    } catch (err) {
      setError(err.message || 'Erro ao conectar com a API')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Função chamada ao clicar no botão de pesquisa
   */
  const handleSearchClick = () => {
    handleSearch(searchQuery)
  }

  /**
   * Função para permitir busca ao pressionar Enter
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    }
  }

  /**
   * Função para extrair informações do livro de forma segura
   */
  const getBookInfo = (book) => {
    const volumeInfo = book.volumeInfo || {}
    let imageUrl = volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196?text=Sem+imagem'
    
    // Converter HTTP para HTTPS e usar proxy para evitar CORS
    if (imageUrl.startsWith('http://')) {
      imageUrl = imageUrl.replace('http://', 'https://')
    }
    
    // Usar proxy para evitar problemas de CORS com Google Books
    if (imageUrl && !imageUrl.includes('placeholder')) {
      imageUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}`
    }
    
    return {
      title: volumeInfo.title || 'Título indisponível',
      authors: volumeInfo.authors || ['Autor desconhecido'],
      image: imageUrl,
      id: book.id,
    }
  }

  return (
    <div className="home">
      {/* Cabeçalho com título do projeto */}
      <header className="home-header">
        <div className="home-brand">
          {!logoError ? (
            <img
              src="/logo.svg"
              alt="Moon Library"
              className="header-logo"
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="home-emoji">📚</span>
          )}

          <div>
            <h1 className="home-title">Moon Library</h1>

        {/* Botão para ir aos Favoritos */}
        <Link to="/favoritos" className="favorites-link">
          ❤️ Meus Favoritos
        </Link>
            <p className="home-subtitle">Descubra seus próximos livros favoritos</p>
          </div>
        </div>
      </header>

      {/* Seção de busca */}
      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Busque por título ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="Campo de busca por título ou autor"
          />
          <button
            className="search-button"
            onClick={handleSearchClick}
            disabled={loading}
            aria-label="Botão de pesquisa"
          >
            {loading ? 'Buscando...' : 'Pesquisar'}
          </button>
          {/* Botão Voltar - aparece quando há resultados de busca */}
          {books.length > 0 && (
            <button
              className="back-button"
              onClick={() => setBooks([])}
              aria-label="Voltar para home"
            >
              ← Voltar
            </button>
          )}
        </div>
      </section>

      {/* Mensagem de erro */}
      {error && (
        <div className="error-message" role="alert">
          ⚠️ {error}
        </div>
      )}

      {/* Estado de carregamento */}
      {loading && (
        <div className="loading-message" role="status">
          ⏳ Buscando livros...
        </div>
      )}

      {/* Listagem de livros */}
      {books.length > 0 && (
        <section className="books-section">
          <h2 className="books-title">
            Livros encontrados: {books.length}
          </h2>
          <div className="books-grid">
            {books.map((book) => {
              const bookInfo = getBookInfo(book)
              const favorite = isFavorite(bookInfo.id)
              return (
                <article key={bookInfo.id} className="book-card">
                  <Link to={`/produto/${bookInfo.id}`} className="book-link">

                    {/* Capa do livro */}
                    <div className="book-image-container">
                      <img
                        src={bookInfo.image}
                        alt={`Capa de ${bookInfo.title}`}
                        className="book-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/128x196?text=Sem+imagem'
                        }}
                      />
                    </div>
                  </Link>

                  {/* Botão de Favoritar */}
                  <button
                    className={`favorite-btn ${favorite ? 'active' : ''}`}
                    onClick={() => toggleFavorite(bookInfo)}
                    title={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    aria-label={favorite ? `Remover ${bookInfo.title} dos favoritos` : `Adicionar ${bookInfo.title} aos favoritos`}
                  >
                    {favorite ? '❤️' : '🤍'}
                  </button>

                  {/* Informações do livro */}
                  <div className="book-info">
                    <h3 className="book-title">{bookInfo.title}</h3>
                    <p className="book-authors">
                      {bookInfo.authors.join(', ')}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* Mensagem inicial quando nenhuma busca foi feita */}
      {!loading && books.length === 0 && !error && (
        <div className="empty-state">
          <p>Nenhum livro carregado. Tente fazer uma pesquisa!</p>
        </div>
      )}
    </div>
  )
}

export default Home

