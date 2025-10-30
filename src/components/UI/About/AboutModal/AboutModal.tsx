import { useEffect } from 'react';
import styles from './AboutModal.module.scss';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
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

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Qui suis-je ?</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Fermer la modale info">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.closeIcon} aria-hidden="true">
                            <line x1="4.5" y1="4.5" x2="15.5" y2="15.5" stroke="#ff4444" strokeWidth="2.2" strokeLinecap="round"/>
                            <line x1="15.5" y1="4.5" x2="4.5" y2="15.5" stroke="#ff4444" strokeWidth="2.2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.section}>
                        <h3>À propos de moi</h3>
                        <p>
                            Né en mai 1994, je suis passionné depuis mon enfance par ce qui se trouve au-delà de notre atmosphère : l’espace infini et ces mystères.
                        </p>
                        <p>
                            J’ai débuté ma carrière en 2013 dans le domaine de l’automobile, avant de me réorienter en 2024 vers le développement web, guidé par mon intérêt pour les technologies et le potentiel de l’intelligence artificielle.<br />
                        </p>
                        <p>
                            Pour moi, l’intelligence artificielle est avant tout un formidable moteur d’innovation. Elle nous accompagne dans notre progression, stimule notre créativité et nous invite à repousser les frontières du possible.<br />
                        </p>
                        <p>
                            En dehors de l’univers du code, je me passionne pour la Formule 1, la science et les nouvelles technologies.<br/>
                            Voyager dans l’espace reste un rêve d’enfant ; en attendant de pouvoir explorer les étoiles, j’aime découvrir notre planète bleue. Chaque destination est une nouvelle frontière qui nourrit ma curiosité et enrichit ma vision du monde.
                        </p>
                    </div>
                    <div className={styles.section}>
                        <h3>Développeur Full Stack</h3>
                        <p>
                            Je développe des applications web, de la création d’interfaces utilisateur élégantes à la mise en place de solutions back-end. Mon approche est de combiner modernité technologique et attention aux détails pour créer des expériences fluides et performantes.
                        </p>
                    </div>

                    <div className={styles.section}>
                        <h3>Technologies</h3>
                        <div className={styles.techGrid}>
                            <span className={`${styles.techTag} ${styles.git}`}>
                                <img src="/logos/git.svg" alt="Git" width="16" height="16" />
                                Git
                            </span>
                            <span className={`${styles.techTag} ${styles.git}`}>
                                <img src="/logos/github.svg" alt="GitHub" width="16" height="16" />
                                GitHub
                            </span>
                            <span className={`${styles.techTag} ${styles.html}`}>
                                <img src="/logos/html5.svg" alt="HTML5" width="16" height="16" />
                                HTML5
                            </span>
                            <span className={`${styles.techTag} ${styles.css}`}>
                                <img src="/logos/css3.svg" alt="CSS3" width="16" height="16" />
                                CSS3
                            </span>
                            <span className={`${styles.techTag} ${styles.scss}`}>
                                <img src="/logos/sass.svg" alt="Sass" width="16" height="16" />
                                SCSS
                            </span>
                            <span className={`${styles.techTag} ${styles.js}`}>
                                <img src="/logos/javascript.svg" alt="JavaScript" width="16" height="16" />
                                JavaScript
                            </span>
                            <span className={`${styles.techTag} ${styles.npm}`}>
                                <img src="/logos/npm.svg" alt="npm" width="16" height="16" />
                                npm
                            </span>
                            <span className={`${styles.techTag} ${styles.react}`}>
                                <img src="/logos/react.svg" alt="React" width="16" height="16" />
                                React
                            </span>
                            <span className={`${styles.techTag} ${styles.redux}`}>
                                <img src="/logos/redux.svg" alt="Redux" width="16" height="16" />
                                Redux
                            </span>
                            <span className={`${styles.techTag} ${styles.reactrouter}`}>
                                <img src="/logos/reactrouter.svg" alt="React Router" width="16" height="16" />
                                React Router
                            </span>
                            <span className={`${styles.techTag} ${styles.nodejs}`}>
                                <img src="/logos/nodedotjs.svg" alt="Node.js" width="16" height="16" />
                                Node.js
                            </span>
                            <span className={`${styles.techTag} ${styles.mongodb}`}>
                                <img src="/logos/mongodb.svg" alt="MongoDB" width="16" height="16" />
                                MongoDB
                            </span>
                            <span className={styles.techTag}>REST API</span>
                            <span className={`${styles.techTag} ${styles.postman}`}>
                                <img src="/logos/postman.svg" alt="Postman" width="16" height="16" />
                                Postman
                            </span>
                            <span className={`${styles.techTag} ${styles.figma}`}>
                                <img src="/logos/figma.svg" alt="Figma" width="16" height="16" />
                                Figma
                            </span>
                            <span className={`${styles.techTag} ${styles.terminal}`}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
                                Terminal
                            </span>
                            <span className={`${styles.techTag} ${styles.typescript}`}>
                                <img src="/logos/typescript.svg" alt="TypeScript" width="16" height="16" />
                                TypeScript
                            </span>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h3>Mes Atouts</h3>
                        <ul className={styles.expertiseList}>
                            <li>Conception d'interfaces utilisateur modernes</li>
                            <li>Développement d'applications React</li>
                            <li>Gestion de données et APIs</li>
                            <li>Collaboration et travail en équipe</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;


