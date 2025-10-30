import { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import styles from './ContactModal.module.scss';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [isSuccess, setIsSuccess] = useState(false);

    // Décoder l'email pour protection contre spam
    const getEmail = () => {
        return atob('YWxhaW4uZGFseS45MzYwMEBnbWFpbC5jb20='); // Base64 encoded
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        // Initialiser EmailJS avec votre public key
        emailjs.init('lab4bhdwWZeI6AkGC');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { name?: string; email?: string; message?: string } = {};

        if (!name.trim()) {
            newErrors.name = 'Veuillez renseigner votre nom';
        }

        if (!email.trim()) {
            newErrors.email = 'Veuillez renseigner votre email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Veuillez renseigner un email valide';
        }

        if (!message.trim()) {
            newErrors.message = 'Veuillez renseigner votre message';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Si tout est valide, envoyer l'email
        try {
            const serviceId = 'service_s5z36vt';
            const templateId = 'template_55vl8tf';

            await emailjs.send(serviceId, templateId, {
                from_name: name,
                from_email: email,
                message: message,
                to_email: getEmail(), // Votre email de réception
            });

            // Reset form
            setName('');
            setEmail('');
            setMessage('');
            setErrors({});

            // Afficher la modal de succès
            setIsSuccess(true);

            // Fermer après 3 secondes
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 3000);
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
            alert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {isSuccess && (
                <div className={styles.successOverlay} onClick={() => setIsSuccess(false)}>
                    <div className={styles.successModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.successIcon}>✓</div>
                        <h2>Message envoyé !</h2>
                        <p>Je vous répondrai dès que possible.</p>
                    </div>
                </div>
            )}
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.modalHeader}>
                        <h2>Contact</h2>
                        <button className={styles.closeButton} onClick={onClose} aria-label="Fermer la modale info">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.closeIcon} aria-hidden="true">
                                <line x1="4.5" y1="4.5" x2="15.5" y2="15.5" stroke="#ff4444" strokeWidth="2.2" strokeLinecap="round"/>
                                <line x1="15.5" y1="4.5" x2="4.5" y2="15.5" stroke="#ff4444" strokeWidth="2.2" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className={styles.modalBody}>
                        <div className={styles.contactInfo}>
                            <p>
                                Actuellement à la recherche de nouvelles opportunités en développement web, je suis ouvert aux projets passionnants et aux équipes dynamiques.
                            </p>
                        </div>

                        <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Nom</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (errors.name) setErrors({ ...errors, name: undefined });
                                    }}
                                    placeholder="Votre nom"
                                />
                                {errors.name && <div className={styles.formError}>{errors.name}</div>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({ ...errors, email: undefined });
                                    }}
                                    placeholder="votre.email@example.com"
                                />
                                {errors.email && <div className={styles.formError}>{errors.email}</div>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                        if (errors.message) setErrors({ ...errors, message: undefined });
                                    }}
                                    rows={6}
                                    placeholder="Votre message..."
                                />
                                {errors.message && <div className={styles.formError}>{errors.message}</div>}
                            </div>

                            <button type="submit" className={styles.submitButton}>
                                <span className={styles.icon}>🚀</span>
                                <span>Envoyer</span>
                            </button>
                        </form>

                        <div className={styles.socialLinks}>
                            <p>Ou contactez-moi directement :</p>
                            <div className={styles.links}>
                                <a
                                    href={`mailto:${getEmail()}`}
                                    className={styles.socialLink}
                                >
                                    <span className={styles.icon}>📧</span>
                                    Email
                                </a>
                                <a
                                    href="https://github.com/Tigershark936"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                >
                                    <span className={styles.icon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </span>
                                    GitHub
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/alain-daly-358608290/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                >
                                    <span className={styles.icon}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </span>
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactModal;
