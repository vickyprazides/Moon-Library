import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Splash from './components/Splash'
import Home from './components/Home'
import BookDetails from './Pages/BookDetails'
import './App.css'

/**
 * Componente principal da aplicação
 * Gerencia transição entre Splash, Home e rotas
 */
function App() {
  // Controla se o splash deve ser exibido
  const [showSplash, setShowSplash] = useState(true)

  /**
   * Handler chamado quando o splash termina (3 segundos)
   */
  const handleSplashFinish = () => {
    setShowSplash(false)
  }

  return (
    <>
      {/* Tela Splash com Logo (3 segundos) */}
      {showSplash && <Splash onFinish={handleSplashFinish} />}

      {/* Rotas da aplicação (após Splash) */}
      {!showSplash && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produto/:id" element={<BookDetails />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  )
}

export default App
