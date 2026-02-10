import { useState } from 'react'
import Splash from './components/Splash'
import Home from './components/Home'
import './App.css'

/**
 * Componente principal da aplicação
 * Gerencia transição entre Splash e Home
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
      {/* Tela Splash com Logo */}
      {showSplash && <Splash onFinish={handleSplashFinish} />}

      {/* Tela Home com Busca de Livros */}
      {!showSplash && <Home />}
    </>
  )
}

export default App
