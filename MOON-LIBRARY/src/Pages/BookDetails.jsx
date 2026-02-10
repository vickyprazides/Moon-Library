import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import'../styles/BookDetails.css';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  if (loading) return <p>Carregando detalhes do livro...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-details">
  <button className="back-button" onClick={() => navigate(-1)}>
    ← Voltar
  </button>

  <div className="book-card">
    <img
      src={
        book.imageLinks?.thumbnail ||
        "https://via.placeholder.com/200x300?text=Sem+imagem"
      }
      alt={book.title}
      className="book-cover"
    />

    <div className="book-info">
      <h1>{book.title}</h1>

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
