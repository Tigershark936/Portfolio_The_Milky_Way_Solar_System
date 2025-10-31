import { useState } from 'react';
import ProjectsModal from '../ProjectsModal/ProjectsModal';
import styles from './ProjectsButton.module.scss';

type ProjectsButtonProps = {
    onOpen?: () => void; // Callback appelé lors de l'ouverture de la modal
};

const ProjectsButton = ({ onOpen }: ProjectsButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        if (onOpen) {
            onOpen();
        }
        setIsModalOpen(true);
    };

    return (
        <>
            <button
                className={styles.projectsButton}
                onClick={handleClick}
                aria-label="Voir mes projets"
            >
                <span className={styles.icon}>🚀</span>
                <span className={styles.text}>Mes Projets</span>
            </button>

            <ProjectsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default ProjectsButton;

