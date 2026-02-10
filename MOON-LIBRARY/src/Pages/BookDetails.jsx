import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function BookDetails() {
  const { id } = useParams(); // pega o id da URL
  const navigate = useNavigate(); // controla navegação
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function buscarLivro() {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setBook(response.data);
      } catch (error) {
        console.error("Erro ao buscar livro:", error);
      } finally {
        setLoading(false);
      }
    }

    buscarLivro();
  }, [id]);

  if (loading) {
    return <p>Carregando detalhes do livro...</p>;
  }

  if (!book) {
    return <p>Livro não encontrado.</p>;
  }

  return (
    <div className="book-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅ Voltar
      </button>

      <div className="details-content">
        <img src={book.image} alt={book.title} />

        <div className="info">
          <h1>{book.title}</h1>

          <p>
            <strong>Autor:</strong> Autor fictício
          </p>

          <p>
            <strong>Descrição:</strong> {book.description}
          </p>

          <p>
            <strong>Data de publicação:</strong> 2022
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
