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

  // Constante com a URL base da Google Books API
  const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

  // Livros populares sugeridos com descrições
  const SUGGESTED_BOOKS_DATA = [
    {
      id: 'harry-potter',
      title: 'Harry Potter and the Philosopher\'s Stone',
      authors: ['J.K. Rowling'],
      image: 'https://images-na.ssl-images-amazon.com/images/P/0439708184.01.L.jpg',
      description: 'Acompanhe Harry Potter em sua jornada ao descobrir que é um bruxo. Ele é convidado para frequentar a Escola de Magia e Bruxaria de Hogwarts, onde fará amigos, enfrentará desafios mágicos e desvendará mistérios que o envolvem desde seu nascimento.'
    },
    {
      id: 'o-senhor-dos-aneis',
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      authors: ['J.R.R. Tolkien'],
      image: 'https://images-na.ssl-images-amazon.com/images/P/0544003411.01.L.jpg',
      description: 'Uma épica fantasia sobre Frodo e sua missão de destruir um anel poderoso em um mundo imaginário cheio de criaturas fantásticas. Uma aventura emocionante através de terras desconhecidas, amizades profundas e sacrifício.'
    },
    {
      id: '1984',
      title: '1984',
      authors: ['George Orwell'],
      image: 'https://images-na.ssl-images-amazon.com/images/P/0451524934.01.L.jpg',
      description: 'Um romance distópico que retrata um futuro sombrio onde um governo totalitário controla a população. A história segue Winston Smith em sua luta pela liberdade em um mundo de vigilância constante e manipulação.'
    },
    {
      id: 'pride-and-prejudice',
      title: 'Pride and Prejudice',
      authors: ['Jane Austen'],
      image: 'https://images-na.ssl-images-amazon.com/images/P/0141439513.01.L.jpg',
      description: 'Um clássico romance que explora os temas de preconceito, classe social e amor. Acompanhe Elizabeth Bennet em sua jornada para encontrar o amor verdadeiro enquanto navega pela sociedade inglesa do século XVIII.'
    },
    {
      id: 'o-hobbit',
      title: 'The Hobbit',
      authors: ['J.R.R. Tolkien'],
      image: 'https://images-na.ssl-images-amazon.com/images/P/0547928270.01.L.jpg',
      description: 'Bilbo Bolseiro, um hobbit pacífico, é arrastado para uma aventura inesperada com um grupo de anões. Juntos, eles buscam recuperar um tesouro de um dragão temível em uma jornada repleta de perigos e descobertas.'
    },
    {
      id: 'cem-anos-de-solidao',
      title: 'One Hundred Years of Solitude',
      authors: ['Gabriel García Márquez'],
      image: 'https://images-na.ssl-images-amazon.com/images/P/0060883286.01.L.jpg',
      description: 'Um romance mágico que acompanha várias gerações da família Buendía em um vilarejo isolado. A história mistura realismo mágico com drama familiar, criando uma narrativa única e envolvente sobre o passar do tempo.'
    }
  ]

  /**
   * Hook useEffect para carregar livros sugeridos na montagem do componente
   */
  useEffect(() => {
    setSuggestedBooks(SUGGESTED_BOOKS_DATA)
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
    // Se é um livro sugerido (já tem estrutura definida)
    if (book.image) {
      return book
    }
    
    // Se é um livro da API Google Books
    const volumeInfo = book.volumeInfo || {}
    return {
      title: volumeInfo.title || 'Título indisponível',
      authors: volumeInfo.authors || ['Autor desconhecido'],
      image: volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x196?text=Sem+imagem',
      description: volumeInfo.description || 'Descrição não disponível',
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
        <>
          <div className="empty-state">
            <p>Digite um título ou autor para começar a buscar livros</p>
          </div>

          {/* Seção de livros sugeridos */}
          <section className="suggested-section">
            <h2 className="suggested-title">📖 Livros populares</h2>
            <div className="books-grid suggested-grid">
              {suggestedBooks.map((book) => {
                const bookInfo = getBookInfo(book)
                return (
                  <article
                    key={bookInfo.id}
                    className="book-card suggested-card"
                    onClick={() => setSelectedBook(bookInfo)}
                  >
                    {/* Capa do livro */}
                    <div className="book-image-container">
                      <img
                        src={bookInfo.image}
                        alt={`Capa de ${bookInfo.title}`}
                        className="book-image"
                        loading="lazy"
                      />
                      <div className="book-overlay">Clique para ver descrição</div>
                    </div>

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
        </>
      )}

      {/* Modal com descrição do livro */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedBook(null)}
              aria-label="Fechar modal"
            >
              ✕
            </button>

            <div className="modal-body">
              <img
                src={selectedBook.image}
                alt={`Capa de ${selectedBook.title}`}
                className="modal-image"
              />

              <div className="modal-info">
                <h2 className="modal-title">{selectedBook.title}</h2>
                <p className="modal-authors">
                  <strong>Autores:</strong> {selectedBook.authors.join(', ')}
                </p>
                <div className="modal-description">
                  <strong>Descrição:</strong>
                  <p>{selectedBook.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

