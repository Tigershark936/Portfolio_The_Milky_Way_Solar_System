import { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import styles from './LoadingPage.module.scss';
import Nebula from '../../components/Nebula/Nebula';
import TwinklingStars from '../../components/TwinklingStars/Stars';
import { preloadCriticalTextures, preloadTextures } from '../../utils/texturePreloader';

type LoadingPageProps = {
    onComplete?: () => void;
};

const FULL_TEXT = "Bienvenue sur mon site web";
const AUTHOR_TEXT = "Alain Daly";

function LoadingPage({ onComplete }: LoadingPageProps) {
    const [criticalTexturesLoaded, setCriticalTexturesLoaded] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    const welcomeRef = useRef<HTMLHeadingElement>(null);
    const authorRef = useRef<HTMLParagraphElement>(null);

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

    // Animation de typing avec manipulation DOM directe (plus fiable)
    useEffect(() => {
        if (!welcomeRef.current || !authorRef.current) return;

        let timeoutId: ReturnType<typeof setTimeout>;
        let currentWelcomeIndex = 0;
        let currentAuthorIndex = 0;
        const TYPING_SPEED = 250; // Très lent pour éliminer tous les glitches

        const typeWelcome = () => {
            if (!welcomeRef.current) return;

            if (currentWelcomeIndex <= FULL_TEXT.length) {
                welcomeRef.current.textContent = FULL_TEXT.substring(0, currentWelcomeIndex);
                currentWelcomeIndex++;
                timeoutId = setTimeout(typeWelcome, TYPING_SPEED);
            } else {
                timeoutId = setTimeout(typeAuthor, 800);
            }
        };

        const typeAuthor = () => {
            if (!authorRef.current) return;

            if (currentAuthorIndex <= AUTHOR_TEXT.length) {
                authorRef.current.textContent = AUTHOR_TEXT.substring(0, currentAuthorIndex);
                currentAuthorIndex++;
                timeoutId = setTimeout(typeAuthor, TYPING_SPEED);
            } else {
                setIsTypingComplete(true);
            }
        };

        // Démarrer l'animation
        timeoutId = setTimeout(typeWelcome, TYPING_SPEED);

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Appeler onComplete après l'animation ET le chargement des textures
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

            {/* Texte par-dessus - Animation DOM directe */}
            <div className={styles.textContainer}>
                <h1 ref={welcomeRef} className={styles.welcomeText}></h1>
                <p ref={authorRef} className={styles.authorText}></p>
            </div>
        </div>
    );
}

export default LoadingPage;

