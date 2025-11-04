import { useState, useEffect, useRef } from 'react';
import styles from './CameraControls.module.scss';

type CameraControlsProps = {
    onSpeedChange: (speed: number) => void;
    onCameraReset: () => void;
    onCameraPreset: (preset: 'overview' | 'close' | 'far' | 'top') => void;
    activeCameraPreset: 'overview' | 'close' | 'far' | 'top' | null;
    onResetPlanetPositions: () => void;
    onMenuToggle?: (isOpen: boolean) => void; // Callback appelé quand le menu s'ouvre/ferme
    forceClose?: boolean; // Force la fermeture du menu
};

const CameraControls = ({ onSpeedChange, onCameraReset: _onCameraReset, onCameraPreset, activeCameraPreset, onResetPlanetPositions, onMenuToggle, forceClose }: CameraControlsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [isMobile, setIsMobile] = useState(false); // Ajout pour la mobile detection
    const controlsRef = useRef<HTMLDivElement>(null);
    const speedRef = useRef<HTMLButtonElement>(null);
    const presetRef = useRef<HTMLButtonElement>(null);

    // Détection mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);

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

    const handlePresetChange = (preset: 'overview' | 'close' | 'far' | 'top') => {
        onCameraPreset(preset);
        // Fermer le menu automatiquement en mobile après sélection d'un bouton caméra
        if (isMobile) {
            setIsOpen(false);
        }
    };

    // Notifier le parent quand le menu s'ouvre/ferme
    useEffect(() => {
        if (onMenuToggle) {
            onMenuToggle(isOpen);
        }
    }, [isOpen, onMenuToggle]);

    // Fermer le menu si forceClose est activé
    useEffect(() => {
        if (forceClose) {
            setIsOpen(false);
        }
    }, [forceClose]);

    const handleToggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.cameraControlsContainer}>
            {/* Bouton caméra */}
            <button
                className={`${styles.cameraButton} ${isOpen ? styles.open : ''}`}
                onClick={handleToggleMenu}
                aria-label="Options"
            >
                <span className={styles.cameraTitle}>OPTIONS</span>
            </button>

            {/* Menu de contrôles */}
            {isOpen && (
                <div ref={controlsRef} className={styles.controls} role="menu" aria-label="Options">
                    <div className={styles.controlsHeader}>
                        <h3>Explore l'univers</h3>
                    </div>

                    <div className={styles.controlsContent}>
                        {/* Contrôle de vitesse */}
                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel}>Vitesse d'animation</label>
                            <div className={styles.speedControls}>
                                <button
                                    ref={speedRef}
                                    className={`${styles.speedButton} ${styles.speedNormal} ${speed === 1 ? styles.active : ''}`}
                                    onClick={() => handleSpeedChange(1)}
                                    role="menuitem"
                                    aria-pressed={speed === 1}
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon}>
                                        {speed === 1 ? '◉' : '○'}
                                    </span>
                                    Normal
                                </button>
                                <button
                                    className={`${styles.speedButton} ${styles.speedFast} ${speed === 100000 ? styles.active : ''}`}
                                    onClick={() => handleSpeedChange(100000)}
                                    role="menuitem"
                                    aria-pressed={speed === 100000}
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon}>
                                        {speed === 100000 ? '◉' : '○'}
                                    </span>
                                    Rapide
                                </button>
                                <button
                                    className={`${styles.speedButton} ${styles.speedUltraFast} ${speed === 1000000 ? styles.active : ''}`}
                                    onClick={() => handleSpeedChange(1000000)}
                                    role="menuitem"
                                    aria-pressed={speed === 1000000}
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon}>
                                        {speed === 1000000 ? '◉' : '○'}
                                    </span>
                                    Ultra rapide
                                </button>
                            </div>

                            {/* Bouton de réinitialisation des positions planétaires */}
                            <button
                                className={`${styles.resetPositionsButton}`}
                                onClick={() => {
                                    // Remettre la vitesse à Normal et recharger les positions en une seule opération fluide
                                    handleSpeedChange(1);
                                    // Utiliser requestAnimationFrame pour un repositionnement fluide
                                    requestAnimationFrame(() => {
                                        onResetPlanetPositions();
                                    });
                                }}
                                role="menuitem"
                                tabIndex={0}
                                title="Remettre les planètes à leur position exacte sur leur orbite (selon l'API) et réinitialiser la vitesse à normale"
                            >
                                Positions réelles
                            </button>
                        </div>

                        {/* Presets de caméra */}
                        <div className={styles.controlGroup}>
                            <label className={styles.controlLabel}>Vue de la caméra</label>
                            <div className={styles.presetControls}>
                                <button
                                    className={`${styles.presetButton} ${styles.closeButton} ${activeCameraPreset === 'close' ? styles.active : ''}`}
                                    onClick={() => handlePresetChange('close')}
                                    role="menuitem"
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: activeCameraPreset === 'close' ? '#00BFFF' : '#8A2BE2' }}>
                                        {activeCameraPreset === 'close' ? '◉' : '○'}
                                    </span>
                                    Vue rapprochée
                                </button>
                                <button
                                    ref={presetRef}
                                    className={`${styles.presetButton} ${styles.overviewButton} ${activeCameraPreset === 'overview' ? styles.active : ''}`}
                                    onClick={() => handlePresetChange('overview')}
                                    role="menuitem"
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: activeCameraPreset === 'overview' ? '#FFD700' : '#8A2BE2' }}>
                                        {activeCameraPreset === 'overview' ? '◉' : '○'}
                                    </span>
                                    Vue d'ensemble
                                </button>
                                <button
                                    className={`${styles.presetButton} ${styles.farButton} ${activeCameraPreset === 'far' ? styles.active : ''}`}
                                    onClick={() => handlePresetChange('far')}
                                    role="menuitem"
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: activeCameraPreset === 'far' ? '#FF6347' : '#8A2BE2' }}>
                                        {activeCameraPreset === 'far' ? '◉' : '○'}
                                    </span>
                                    Vue éloignée
                                </button>
                                <button
                                    className={`${styles.presetButton} ${styles.topButton} ${activeCameraPreset === 'top' ? styles.active : ''}`}
                                    onClick={() => handlePresetChange('top')}
                                    role="menuitem"
                                    tabIndex={0}
                                >
                                    <span className={styles.buttonIcon} style={{ color: activeCameraPreset === 'top' ? '#00FF7F' : '#8A2BE2' }}>
                                        {activeCameraPreset === 'top' ? '◉' : '○'}
                                    </span>
                                    Vue de haut (360°)
                                </button>
                            </div>
                        </div>

                        {/** Reset caméra supprimé (doublon avec Vue d'ensemble) **/}

                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraControls;
