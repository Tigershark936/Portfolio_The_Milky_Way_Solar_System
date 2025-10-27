import { useState, useEffect, useRef } from 'react';
import styles from './PlanetSelector.module.scss';

type PlanetSelectorProps = {
    planets: Array<{ name: string; distance: number; size: number; color: string }>;
    onPlanetSelect: (planetName: string | null) => void;
    selectedPlanet: string | null;
};

const PlanetSelector = ({ planets, onPlanetSelect, selectedPlanet }: PlanetSelectorProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectorRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

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
        if (isOpen && selectorRef.current) {
            const focusableElements = selectorRef.current.querySelectorAll(
                'button, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                (focusableElements[0] as HTMLElement).focus();
            }
        }
    }, [isOpen]);

    const handlePlanetClick = (planetName: string) => {
        if (selectedPlanet === planetName) {
            onPlanetSelect(null); // Désélectionner si déjà sélectionné
        } else {
            onPlanetSelect(planetName);
        }
        setIsOpen(false); // Fermer la barre après sélection
    };


    return (
        <div className={styles.planetSelectorContainer}>
            {/* Bouton principal */}
            <button
                ref={buttonRef}
                className={`${styles.selectorButton} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Sélectionner une planète"
            >
                <span className={styles.selectorTitle}>
                    {selectedPlanet ? `Suivre: ${selectedPlanet}` : 'Sélectionner planète'}
                </span>
            </button>

            {/* Barre de sélection */}
            {isOpen && (
                <div ref={selectorRef} className={styles.planetBar} role="menu" aria-label="Sélection de planète">
                    <div className={styles.planetList}>
                        {planets.map((planet) => (
                            <button
                                key={planet.name}
                                className={`${styles.planetButton} ${selectedPlanet === planet.name ? styles.selected : ''}`}
                                onClick={() => handlePlanetClick(planet.name)}
                                role="menuitem"
                                aria-pressed={selectedPlanet === planet.name}
                                tabIndex={0}
                                style={{
                                    '--planet-color': planet.color,
                                    '--planet-color-rgb': planet.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', '),
                                    '--planet-size': `${Math.max(planet.size * 2, 0.5)}rem`
                                } as React.CSSProperties}
                            >
                                <span className={styles.planetName}>{planet.name}</span>
                            </button>
                        ))}

                        {/* Bouton pour arrêter le suivi avec croix */}
                        <button
                            className={`${styles.planetButton} ${styles.stopFollow}`}
                            onClick={() => {
                                onPlanetSelect(null);
                                setIsOpen(false);
                            }}
                            role="menuitem"
                            tabIndex={0}
                            aria-label="Arrêter le suivi"
                        >
                            <span className={styles.stopIcon}>✕</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanetSelector;
