import { useState } from 'react';
import styles from './AboutButton.module.scss';
import AboutModal from '../AboutModal/AboutModal';

const AboutButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                className={styles.aboutButton}
                onClick={handleClick}
                aria-label="Qui suis-je ?"
            >
                <span className={styles.icon}>👤</span>
                <span className={styles.text}>Qui suis-je ?</span>
            </button>
            <AboutModal isOpen={isModalOpen} onClose={handleClose} />
        </>
    );
};

export default AboutButton;


