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
    const [showLightBar, setShowLightBar] = useState(false);
    const [showBigBang, setShowBigBang] = useState(false);

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

    // Déclencher l'apparition de la barre de lumière avant le Big Bang (4.5s)
    useEffect(() => {
        if (criticalTexturesLoaded) {
            const lightBarTimer = setTimeout(() => {
                setShowLightBar(true);
            }, 4500); // Commence avant la fin du texte pour une transition douce

            return () => clearTimeout(lightBarTimer);
        }
    }, [criticalTexturesLoaded]);

    // Déclencher l'animation Big Bang après que la barre de lumière soit à sa longueur maximale
    useEffect(() => {
        if (criticalTexturesLoaded) {
            // La barre commence à 4.5s et atteint 100vw à 50% de son animation (6s * 0.5 = 3s)
            // Donc 4.5s + 3s = 7.5s pour atteindre la longueur maximale
            // On commence le Big Bang juste après, à 7.8s
            const bigBangTimer = setTimeout(() => {
                setShowBigBang(true);
            }, 7800);

            return () => clearTimeout(bigBangTimer);
        }
    }, [criticalTexturesLoaded]);

    // Timer simple pour terminer après les textures + animation CSS + Big Bang
    useEffect(() => {
        if (criticalTexturesLoaded) {
            // Durée totale: 7.8s (début Big Bang) + 5s (Big Bang) = 12.8s
            // On déclenche la transition 0.5s avant la fin pour un fondu fluide
            const timer = setTimeout(() => {
                if (onComplete) {
                    onComplete();
                }
            }, 12300); // 12.3s pour commencer le fade avant la fin

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

            {/* Barre de lumière horizontale - apparaît en premier */}
            {showLightBar && (
                <div className={styles.bigBangContainer}>
                    <div className={styles.lightBar}></div>
                </div>
            )}

            {/* Animation Big Bang */}
            {showBigBang && (
                <div className={styles.bigBangContainer}>
                    {/* Flash initial intense */}
                    <div className={styles.bigBangFlash}></div>

                    {/* Barre de lumière horizontale synchronisée avec l'explosion */}
                    <div className={styles.lightBarSync}></div>

                    {/* Cœur de l'explosion */}
                    <div className={styles.bigBangCore}></div>

                    {/* Particules qui explosent pour représenter les galaxies */}
                    {(() => {
                        const particles: React.ReactElement[] = [];
                        let particleIndex = 0;

                        // Vagues de galaxies avec des délais différents
                        const waves = [
                            { count: 3, delay: 0, distance: 400 },
                            { count: 10, delay: 0.3, distance: 600 },
                            { count: 5, delay: 0.7, distance: 500 },
                            { count: 8, delay: 1.1, distance: 700 },
                            { count: 6, delay: 1.5, distance: 560 },
                            { count: 12, delay: 1.9, distance: 800 },
                            { count: 4, delay: 2.3, distance: 440 },
                            { count: 9, delay: 2.7, distance: 760 },
                            { count: 7, delay: 3.1, distance: 640 },
                            { count: 5, delay: 3.5, distance: 900 },
                            { count: 8, delay: 3.9, distance: 720 },
                            { count: 6, delay: 4.3, distance: 840 },
                        ];

                        waves.forEach((wave, waveIndex) => {
                            for (let i = 0; i < wave.count; i++) {
                                // Angle aléatoire pour chaque galaxie
                                const baseAngle = (waveIndex * 30) + (i * (360 / wave.count));
                                const randomOffset = (Math.random() - 0.5) * 40;
                                const angle = baseAngle + randomOffset;
                                const angleRad = (angle * Math.PI) / 180;

                                // Distance variable avec un peu d'aléatoire
                                const randomDistance = wave.distance + (Math.random() - 0.5) * 160;
                                const x = Math.cos(angleRad) * randomDistance;
                                const y = Math.sin(angleRad) * randomDistance;

                                particles.push(
                                    <div
                                        key={particleIndex}
                                        className={styles.particle}
                                        style={{
                                            '--particle-index': particleIndex,
                                            '--particle-distance-x': `${x}px`,
                                            '--particle-distance-y': `${y}px`,
                                            '--particle-delay': `${wave.delay}s`,
                                        } as React.CSSProperties}
                                    ></div>
                                );
                                particleIndex++;
                            }
                        });

                        return particles;
                    })()}
                </div>
            )}
        </div>
    );
}

export default LoadingPage;

