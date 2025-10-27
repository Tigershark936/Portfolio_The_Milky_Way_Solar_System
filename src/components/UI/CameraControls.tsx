import { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import styles from './CameraControls.module.scss';

type CameraControlsProps = {
    onSpeedChange: (speed: number) => void;
    onCameraReset: () => void;
    onCameraPreset: (preset: 'overview' | 'close' | 'far') => void;
};

const CameraControls = ({ onSpeedChange, onCameraReset, onCameraPreset }: CameraControlsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 50, z: 130 });
    const controlsRef = useRef<HTMLDivElement>(null);
    const speedRef = useRef<HTMLButtonElement>(null);
    const resetRef = useRef<HTMLButtonElement>(null);
    const presetRef = useRef<HTMLButtonElement>(null);

    // Gestion des événements clavier
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // Focus management avec Tab
    useEffect(() => {
        if (isOpen && controlsRef.current) {
            const focusableElements = controlsRef.current.querySelectorAll(
                'button, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                (focusableElements[0] as HTMLElement).focus();
            }
        }
    }, [isOpen]);

    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed);
        onSpeedChange(newSpeed);
    };

    const handleCameraReset = () => {
        setCameraPosition({ x: 0, y: 50, z: 130 });
        onCameraReset();
    };

    const handlePresetChange = (preset: 'overview' | 'close' | 'far') => {
        onCameraPreset(preset);
    };

    return (
        <div className={styles.cameraControlsContainer}>
            {/* Bouton caméra */}
            <button
                className={`${styles.cameraButton} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Contrôles de la caméra"
            >
                <span className={styles.cameraTitle}>CAMÉRA</span>
            </button>

            {/* Menu de contrôles */}
            {isOpen && (
                <div ref={controlsRef} className={styles.controls} role="menu" aria-label="Contrôles de la caméra">
                    <div className={styles.controlsHeader}>
                        <h3>Contrôles de la caméra</h3>
                    </div>

                    <div className={styles.controlsContent}>
                        {/* Contrôle de vitesse */}
                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel}>Vitesse d'animation</label>
                            <div className={styles.speedControls}>
                                <button
                                    ref={speedRef}
                                    className={`${styles.speedButton} ${speed === 0.1 ? styles.active : ''}`}
                                    onClick={() => handleSpeedChange(0.1)}
                                    role="menuitem"
                                    aria-pressed={speed === 0.1}
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: speed === 0.1 ? '#4169E1' : '#8A2BE2' }}>
                                        {speed === 0.1 ? '◉' : '○'}
                                    </span>
                                    Lente
                                </button>
                                <button
                                    className={`${styles.speedButton} ${speed === 1 ? styles.active : ''}`}
                                    onClick={() => handleSpeedChange(1)}
                                    role="menuitem"
                                    aria-pressed={speed === 1}
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: speed === 1 ? '#4169E1' : '#8A2BE2' }}>
                                        {speed === 1 ? '◉' : '○'}
                                    </span>
                                    Normale
                                </button>
                                <button
                                    className={`${styles.speedButton} ${speed === 5 ? styles.active : ''}`}
                                    onClick={() => handleSpeedChange(5)}
                                    role="menuitem"
                                    aria-pressed={speed === 5}
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: speed === 5 ? '#4169E1' : '#8A2BE2' }}>
                                        {speed === 5 ? '◉' : '○'}
                                    </span>
                                    Rapide
                                </button>
                            </div>
                        </div>

                        {/* Presets de caméra */}
                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel}>Vue de la caméra</label>
                            <div className={styles.presetControls}>
                                <button
                                    ref={presetRef}
                                    className={`${styles.presetButton} ${styles.overviewButton}`}
                                    onClick={() => handlePresetChange('overview')}
                                    role="menuitem"
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: '#8A2BE2' }}>
                                        🌌
                                    </span>
                                    Vue d'ensemble
                                </button>
                                <button
                                    className={`${styles.presetButton} ${styles.closeButton}`}
                                    onClick={() => handlePresetChange('close')}
                                    role="menuitem"
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: '#8A2BE2' }}>
                                        🔍
                                    </span>
                                    Vue rapprochée
                                </button>
                                <button
                                    className={`${styles.presetButton} ${styles.farButton}`}
                                    onClick={() => handlePresetChange('far')}
                                    role="menuitem"
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: '#8A2BE2' }}>
                                        🚀
                                    </span>
                                    Vue éloignée
                                </button>
                            </div>
                        </div>

                        {/* Reset caméra */}
                        <div className={styles.controlGroup}>
                            <button
                                ref={resetRef}
                                className={styles.resetButton}
                                onClick={handleCameraReset}
                                role="menuitem"
                                tabIndex={0}
                            >
                                <span className={styles.buttonIcon} style={{ color: '#FFD700' }}>
                                    🔄
                                </span>
                                Reset caméra
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraControls;
