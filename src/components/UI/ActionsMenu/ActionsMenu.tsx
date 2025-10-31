import { useState } from 'react';
import styles from './ActionsMenu.module.scss';

type ActionsMenuProps = {
    onAboutClick: () => void;
    onProjectsClick: () => void;
    onContactClick: () => void;
    onMenuButtonClick?: () => void; // Callback quand on clique sur le bouton hamburger
    onMenuOpenChange?: (isOpen: boolean) => void; // Callback pour notifier l'état d'ouverture du menu
};

function ActionsMenu({ onAboutClick, onProjectsClick, onContactClick, onMenuButtonClick, onMenuOpenChange }: ActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
        if (onMenuOpenChange) {
            onMenuOpenChange(false);
        }
    };

    const handleMenuButtonClick = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        if (onMenuButtonClick) {
            onMenuButtonClick();
        }
        if (onMenuOpenChange) {
            onMenuOpenChange(newState);
        }
    };

    return (
        <div className={styles.actionsMenuContainer}>
            {/* Bouton Menu dans le coin droit */}
            <button
                className={`${styles.menuButton} ${isOpen ? styles.open : ''}`}
                onClick={handleMenuButtonClick}
                aria-label="Menu des actions"
                aria-expanded={isOpen}
            >
                <div className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className={styles.dropdownMenu}>
                    <button
                        className={styles.menuItem}
                        onClick={() => handleAction(onAboutClick)}
                    >
                        <span className={styles.icon}>👤</span>
                        <span>Qui suis-je ?</span>
                    </button>

                    <button
                        className={styles.menuItem}
                        onClick={() => handleAction(onProjectsClick)}
                    >
                        <span className={styles.icon}>🚀</span>
                        <span>Mes Projets</span>
                    </button>

                    <button
                        className={styles.menuItem}
                        onClick={() => handleAction(onContactClick)}
                    >
                        <span className={styles.icon}>🔗</span>
                        <span>Contact</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default ActionsMenu;

