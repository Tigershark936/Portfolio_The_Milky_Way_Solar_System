import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import styles from './LoadingPage.module.scss';
import Nebula from '../../components/Nebula/Nebula';
import TwinklingStars from '../../components/TwinklingStars/Stars';
import { preloadCriticalTextures, preloadTextures } from '../../utils/texturePreloader';

type LoadingPageProps = {
    onComplete?: () => void;
};

const FULL_TEXT = "Bienvenue sur mon portfolio";
const AUTHOR_TEXT = "par Alain Daly";

function LoadingPage({ onComplete }: LoadingPageProps) {
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

    // Timer simple pour terminer après les textures + animation CSS
    useEffect(() => {
        if (criticalTexturesLoaded) {
            // Durée totale: 5s (animation CSS) + 2s (lecture)
            const timer = setTimeout(() => {
                if (onComplete) {
                    onComplete();
                }
            }, 7000);

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

            {/* Texte par-dessus - Animation CSS pure */}
            {criticalTexturesLoaded && (
                <div className={styles.textContainer}>
                    <h1 className={styles.welcomeText}>{FULL_TEXT}</h1>
                    <p className={styles.authorText}>{AUTHOR_TEXT}</p>
                </div>
            )}
        </div>
    );
}

export default LoadingPage;

