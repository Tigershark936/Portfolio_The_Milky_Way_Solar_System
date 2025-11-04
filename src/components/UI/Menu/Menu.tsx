import { useState, useEffect, useRef } from 'react';
import styles from './Menu.module.scss';

type MenuProps = {
    showPlanetNames: boolean;
    showMoonNames: boolean;
    showOrbits: boolean;
    showAsteroids: boolean;
    onTogglePlanetNames: () => void;
    onToggleMoonNames: () => void;
    onToggleOrbits: () => void;
    onToggleAsteroids: () => void;
};

const Menu = ({ showPlanetNames, showMoonNames, showOrbits, showAsteroids, onTogglePlanetNames, onToggleMoonNames, onToggleOrbits, onToggleAsteroids }: MenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const planetButtonRef = useRef<HTMLButtonElement>(null);
    const moonButtonRef = useRef<HTMLButtonElement>(null);

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
        if (isOpen && menuRef.current) {
            const focusableElements = menuRef.current.querySelectorAll(
                'button, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                (focusableElements[0] as HTMLElement).focus();
            }
        }
    }, [isOpen]);

    // Handlers pour fermer le menu en mobile
    const handleTogglePlanetNames = () => {
        onTogglePlanetNames();
        if (isMobile) {
            setIsOpen(false);
        }
    };

    const handleToggleMoonNames = () => {
        onToggleMoonNames();
        if (isMobile) {
            setIsOpen(false);
        }
    };

    return (
        <div className={styles.menuContainer}>
            {/* Bouton menu */}
            <button
                className={`${styles.menuButton} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Ouvrir le menu"
            >
                <div className={`${styles.settingsIcon} ${isOpen ? styles.open : ''}`}>
                    ⚙️
                </div>
            </button>

            {/* Menu déroulant */}
            {isOpen && (
                <div ref={menuRef} className={styles.menu} role="menu" aria-label="Options d'affichage">
                    <div className={styles.menuHeader}>
                        <h3>Options d'affichage</h3>
                    </div>

                    <div className={styles.menuContent}>
                        <div className={styles.option}>
                            <button
                                ref={planetButtonRef}
                                className={`${styles.toggleButton} ${showPlanetNames ? styles.active : ''}`}
                                onClick={handleTogglePlanetNames}
                                role="menuitem"
                                aria-pressed={showPlanetNames}
                                tabIndex={0}
                            >
                                <span className={styles.buttonIcon} style={{ color: showPlanetNames ? '#4169E1' : '#8A2BE2' }}>
                                    {showPlanetNames ? '◉' : '○'}
                                </span>
                                Noms des planètes
                            </button>
                        </div>

                        <div className={styles.option}>
                            <button
                                ref={moonButtonRef}
                                className={`${styles.toggleButton} ${styles.moonButton} ${showMoonNames ? styles.active : ''}`}
                                onClick={handleToggleMoonNames}
                                role="menuitem"
                                aria-pressed={showMoonNames}
                                tabIndex={0}
                            >
                                <span className={styles.buttonIcon} style={{ color: showMoonNames ? '#FFD700' : '#8A2BE2' }}>
                                    {showMoonNames ? '◉' : '○'}
                                </span>
                                Noms des lunes
                            </button>
                        </div>

                        <div className={styles.option}>
                            <button
                                className={`${styles.toggleButton} ${styles.orbitButton} ${showOrbits ? styles.active : ''}`}
                                onClick={onToggleOrbits}
                                role="menuitem"
                                aria-pressed={showOrbits}
                                tabIndex={0}
                            >
                                <span className={styles.buttonIcon} style={{ color: showOrbits ? '#FF6B35' : '#8A2BE2' }}>
                                    {showOrbits ? '◉' : '○'}
                                </span>
                                Orbites
                            </button>
                        </div>

                        <div className={styles.option}>
                            <button
                                className={`${styles.toggleButton} ${styles.asteroidButton} ${showAsteroids ? styles.active : ''}`}
                                onClick={onToggleAsteroids}
                                role="menuitem"
                                aria-pressed={showAsteroids}
                                tabIndex={0}
                            >
                                <span className={styles.buttonIcon} style={{ color: showAsteroids ? '#8B3A3A' : '#8A2BE2' }}>
                                    {showAsteroids ? '◉' : '○'}
                                </span>
                                Ceintures d'astéroïdes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
