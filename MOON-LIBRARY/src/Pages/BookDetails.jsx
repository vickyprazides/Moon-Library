import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFavorites } from "../contexts/FavoritesContext";
import '../styles/BookDetails.css';
import DOMPurify from "dompurify";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );

        if (!response.ok) {
          throw new Error("Livro não encontrado.");
        }

        const data = await response.json();
        setBook(data.volumeInfo);
        setFavorite(isFavorite(id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id, isFavorite]);

  if (loading) return <p>Carregando detalhes do livro...</p>;
  if (error) return <p>{error}</p>;

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/200x300?text=Sem+imagem';
    
    let url = imageUrl;
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }
    
    // Usar proxy para evitar problemas de CORS
    if (url && !url.includes('placeholder')) {
      url = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
    }
    
    return url;
  };

  const handleFavorite = () => {
    const bookData = {
      id: id,
      title: book.title,
      authors: book.authors || ['Autor desconhecido'],
      image: getImageUrl(book.imageLinks?.thumbnail),
    };
    toggleFavorite(bookData);
    setFavorite(!favorite);
  };

  return (
    <div className="book-details">
      <nav className="details-nav">
        <button className="back-button" onClick={() => navigate(-1)}>
          ⬅ Voltar
        </button>
        <Link to="/favoritos" className="favorites-nav-link">
          ❤️ Meus Favoritos
        </Link>
      </nav>

      <div className="details-content">
        <img
          src={getImageUrl(book.imageLinks?.thumbnail)}
          alt={book.title}
          className="detail-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200x300?text=Sem+imagem';
          }}
        />

        <div className="info">
          <div className="info-header">
            <h1>{book.title}</h1>
            <button
              className={`favorite-btn-details ${favorite ? 'active' : ''}`}
              onClick={handleFavorite}
              title={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-label={favorite ? `Remover ${book.title} dos favoritos` : `Adicionar ${book.title} aos favoritos`}
            >
              {favorite ? '❤️' : '🤍'}
            </button>
          </div>

      <p className="author">
        {book.authors ? book.authors.join(", ") : "Autor desconhecido"}
      </p>

      <div
  className="description"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(
      book.description || "Descrição indisponível."
    ),
  }}
/>
      <span className="date">
        Publicado em {book.publishedDate || "—"}
      </span>
    </div>
  </div>
</div>
  );
}

export default BookDetails;
