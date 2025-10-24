import { useState, useEffect, useRef } from 'react';
import styles from './Menu.module.scss';

type MenuProps = {
    showPlanetNames: boolean;
    showMoonNames: boolean;
    onTogglePlanetNames: () => void;
    onToggleMoonNames: () => void;
};

const Menu = ({ showPlanetNames, showMoonNames, onTogglePlanetNames, onToggleMoonNames }: MenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const planetButtonRef = useRef<HTMLButtonElement>(null);
    const moonButtonRef = useRef<HTMLButtonElement>(null);

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

    return (
        <div className={styles.menuContainer}>
            {/* Bouton menu */}
            <button
                className={`${styles.menuButton} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Ouvrir le menu"
            >
                <div className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
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
                                onClick={onTogglePlanetNames}
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
                                onClick={onToggleMoonNames}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
