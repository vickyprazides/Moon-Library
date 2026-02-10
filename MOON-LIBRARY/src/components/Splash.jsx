import { useState, useEffect } from 'react'
import '../styles/Splash.css'

/**
 * Componente Splash - Tela inicial com logo/branding
 * Exibida por 3 segundos ao carregamento da aplicação
 */
function Splash({ onFinish }) {
  useEffect(() => {
    // Timer de 3 segundos para transição
    const timer = setTimeout(() => {
      onFinish()
    }, 3000)

    // Limpeza do timer
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <div className="splash">
      <div className="splash-container">
        {/* Logo com animação */}
        <div className="splash-logo-wrapper">
          <img
              src="/logo.svg"
              alt="Moon Library Logo"
              className="splash-logo"
            />
        </div>

        {/* Título com animação */}
        <h1 className="splash-title">Moon Library</h1>

        {/* Subtítulo com animação */}
        <p className="splash-subtitle">Descobra seus próximos livros favoritos</p>

        {/* Indicador de carregamento */}
        <div className="splash-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    </div>
  )
}

export default Splash
