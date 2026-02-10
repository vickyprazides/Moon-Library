import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home'
import BookDetails from "./Pages/BookDetails";
import './App.css'

/**
 * Componente principal da aplicação
 * Renderiza a página Home do site de livros
 */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produto/:id" element={<BookDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
