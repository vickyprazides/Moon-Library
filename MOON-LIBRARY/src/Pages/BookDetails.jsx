import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
        ⬅ Voltar
      </button>

      <div className="details-content">
        <img
          src={
            book.imageLinks?.thumbnail ||
            "https://via.placeholder.com/200x300?text=Sem+imagem"
          }
          alt={book.title}
        />

        <div className="info">
          <h1>{book.title}</h1>

          <p>
            <strong>Autor:</strong>{" "}
            {book.authors ? book.authors.join(", ") : "Autor desconhecido"}
          </p>

          <p>
            <strong>Descrição:</strong>{" "}
            {book.description || "Descrição indisponível."}
          </p>

          <p>
            <strong>Data de publicação:</strong>{" "}
            {book.publishedDate || "Não informada"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
