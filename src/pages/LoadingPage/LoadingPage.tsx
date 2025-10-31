import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import styles from './LoadingPage.module.scss';
import Nebula from '../../components/Nebula/Nebula';
import TwinklingStars from '../../components/TwinklingStars/Stars';
import { preloadCriticalTextures, preloadTextures } from '../../utils/texturePreloader';

type LoadingPageProps = {
    onComplete?: () => void;
};

const FULL_TEXT = "Bienvenue sur le portfolio de Alain";
const AUTHOR_TEXT = "par alain daly";
const TYPING_SPEED = 150; // Vitesse de frappe ralentie pour être visible

function LoadingPage({ onComplete }: LoadingPageProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [displayedAuthor, setDisplayedAuthor] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [showAuthorCursor, setShowAuthorCursor] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const [startAuthorTyping, setStartAuthorTyping] = useState(false);

    const [criticalTexturesLoaded, setCriticalTexturesLoaded] = useState(false);

    // Précharger les textures critiques (nébuleuse, soleil) en premier pour affichage immédiat
    useEffect(() => {
        // Charger les textures critiques d'abord (nébuleuse et soleil)
        preloadCriticalTextures()
            .then(() => {
                setCriticalTexturesLoaded(true);
            })
            .catch((error) => {
                console.warn('Erreur lors du préchargement des textures critiques:', error);
                setCriticalTexturesLoaded(true); // Continuer même en cas d'erreur
            });

        // En parallèle, continuer à charger toutes les autres textures en arrière-plan
        preloadTextures().catch((error) => {
            console.warn('Erreur lors du préchargement des textures:', error);
        });
    }, []);

    // Animation de frappe au clavier pour le titre (démarre immédiatement)
    useEffect(() => {
        let isMounted = true;
        let currentIndex = 0;
        let cursorInterval: ReturnType<typeof setInterval>;

        // Animation du curseur clignotant
        cursorInterval = setInterval(() => {
            if (isMounted) {
                setShowCursor(prev => !prev);
            }
        }, 600);

        // Animation de typing avec setTimeout récursif
        const typeNextChar = () => {
            if (!isMounted) return;
            
            if (currentIndex < FULL_TEXT.length) {
                currentIndex++;
                setDisplayedText(FULL_TEXT.substring(0, currentIndex));
                setTimeout(typeNextChar, TYPING_SPEED);
            } else {
                clearInterval(cursorInterval);
                setShowCursor(false);
                setTimeout(() => {
                    if (isMounted) {
                        setStartAuthorTyping(true);
                    }
                }, 800);
            }
        };

        // Démarrer l'animation
        setTimeout(typeNextChar, TYPING_SPEED);

        return () => {
            isMounted = false;
            clearInterval(cursorInterval);
        };
    }, []);

    // Animation de frappe au clavier pour l'auteur
    useEffect(() => {
        if (!startAuthorTyping) return;

        let isMounted = true;
        let currentIndex = 0;
        let cursorInterval: ReturnType<typeof setInterval>;

        // Animation du curseur clignotant
        setShowAuthorCursor(true);
        cursorInterval = setInterval(() => {
            if (isMounted) {
                setShowAuthorCursor(prev => !prev);
            }
        }, 600);

        // Animation de typing avec setTimeout récursif
        const typeNextChar = () => {
            if (!isMounted) return;
            
            if (currentIndex < AUTHOR_TEXT.length) {
                currentIndex++;
                setDisplayedAuthor(AUTHOR_TEXT.substring(0, currentIndex));
                setTimeout(typeNextChar, TYPING_SPEED);
            } else {
                clearInterval(cursorInterval);
                setShowAuthorCursor(false);
                setIsTypingComplete(true);
            }
        };

        // Démarrer l'animation
        setTimeout(typeNextChar, TYPING_SPEED);

        return () => {
            isMounted = false;
            clearInterval(cursorInterval);
        };
    }, [startAuthorTyping]);

    // Appeler onComplete après la fin du typing ET quand les textures critiques sont chargées
    // Avec un délai minimum pour que l'utilisateur puisse lire le message
    useEffect(() => {
        if (isTypingComplete && criticalTexturesLoaded) {
            // Délai de 2 secondes pour laisser le temps de lire
            const timer = setTimeout(() => {
                if (onComplete) {
                    onComplete();
                }
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isTypingComplete, criticalTexturesLoaded, onComplete]);

    return (
        <div className={styles.loadingContainer}>
            {/* Fond nébuleuse avec Three.js - Rendu conditionnel pour éviter les blocages */}
            {criticalTexturesLoaded && (
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 75 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0
                    }}
                    onCreated={(state) => {
                        state.gl.setClearColor('#0f0f23');
                    }}
                >
                    <Nebula />
                    <TwinklingStars />
                </Canvas>
            )}

            {/* Texte par-dessus - S'affiche TOUJOURS indépendamment du Canvas */}
            <div className={styles.textContainer}>
                <h1 className={styles.welcomeText}>
                    {displayedText}
                    {showCursor && displayedText.length < FULL_TEXT.length && (
                        <span className={styles.cursor}>|</span>
                    )}
                </h1>
                {startAuthorTyping && (
                    <p className={styles.authorText}>
                        {displayedAuthor}
                        {showAuthorCursor && displayedAuthor.length < AUTHOR_TEXT.length && (
                            <span className={styles.cursor}>|</span>
                        )}
                    </p>
                )}
            </div>
        </div>
    );
}

export default LoadingPage;

