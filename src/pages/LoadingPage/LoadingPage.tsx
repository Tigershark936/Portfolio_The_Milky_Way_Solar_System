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

function LoadingPage({ onComplete }: LoadingPageProps) {
    // Afficher directement le texte complet (pas d'animation pour l'instant)
    const [displayedText] = useState(FULL_TEXT);
    const [displayedAuthor] = useState(AUTHOR_TEXT);
    const [showCursor] = useState(false);
    const [showAuthorCursor] = useState(false);

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

    // Plus d'animation de typing - texte affiché directement
    // TODO: Réimplémenter l'animation quand on comprendra pourquoi elle ne fonctionne pas sur Netlify

    // Appeler onComplete après le chargement des textures critiques
    // Avec un délai de 3 secondes pour laisser le temps de lire le message
    useEffect(() => {
        if (criticalTexturesLoaded) {
            // Délai de 3 secondes pour laisser le temps de lire
            const timer = setTimeout(() => {
                if (onComplete) {
                    onComplete();
                }
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [criticalTexturesLoaded, onComplete]);

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
                <p className={styles.authorText}>
                    {displayedAuthor}
                    {showAuthorCursor && displayedAuthor.length < AUTHOR_TEXT.length && (
                        <span className={styles.cursor}>|</span>
                    )}
                </p>
            </div>
        </div>
    );
}

export default LoadingPage;

