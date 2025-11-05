import { useState } from 'react';
import HomePage from './pages/HomePage/HomePage';
import LoadingPage from './pages/LoadingPage/LoadingPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showHomePage, setShowHomePage] = useState(false);
  const [homePageOpacity, setHomePageOpacity] = useState(0);

  const handleLoadingComplete = () => {
    // Préparer la HomePage
    setShowHomePage(true);

    // Commencer le fade-in immédiatement pour une transition fluide
    // Le Canvas se prépare en arrière-plan pendant le fade
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHomePageOpacity(1);
        // Masquer la LoadingPage après le fade-in
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Délai pour laisser le fade-in se terminer
      });
    });
  };

  return (
    <>
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10000,
          opacity: homePageOpacity > 0 ? 1 - homePageOpacity : 1,
          transition: 'opacity 0.6s ease-out',
          pointerEvents: homePageOpacity > 0 ? 'none' : 'auto'
        }}>
          <LoadingPage onComplete={handleLoadingComplete} />
        </div>
      )}
      {showHomePage && (
        <div style={{
          position: homePageOpacity > 0 ? 'relative' : 'fixed',
          opacity: homePageOpacity,
          transition: 'opacity 0.6s ease-in',
          width: '100vw',
          height: '100vh',
          background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
          zIndex: homePageOpacity > 0 ? 1 : 0
        }}>
          <HomePage />
        </div>
      )}
    </>
  );
}

export default App;
