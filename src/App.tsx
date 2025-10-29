import { useState } from 'react';
import HomePage from './pages/HomePage/HomePage';
import LoadingPage from './pages/LoadingPage/LoadingPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingPage onComplete={handleLoadingComplete} />;
  }

  return <HomePage />;
}

export default App;
