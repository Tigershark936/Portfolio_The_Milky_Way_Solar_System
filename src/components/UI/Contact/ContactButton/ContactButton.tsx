import { useState } from 'react';
import styles from './ContactButton.module.scss';
import ContactModal from '../ContactModal/ContactModal';

type ContactButtonProps = {
    onOpen?: () => void; // Callback appelé lors de l'ouverture de la modal
};

const ContactButton = ({ onOpen }: ContactButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        if (onOpen) {
            onOpen();
        }
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                className={styles.contactButton}
                onClick={handleClick}
                aria-label="Contact"
            >
                <span className={styles.icon}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                </span>
                <span className={styles.text}>Contact</span>
            </button>
            <ContactModal isOpen={isModalOpen} onClose={handleClose} />
        </>
    );
};

export default ContactButton;

