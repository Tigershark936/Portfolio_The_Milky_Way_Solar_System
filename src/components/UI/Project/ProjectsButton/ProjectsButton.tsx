import { useState } from 'react';
import ProjectsModal from '../ProjectsModal/ProjectsModal';
import styles from './ProjectsButton.module.scss';

const ProjectsButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                className={styles.projectsButton}
                onClick={() => setIsModalOpen(true)}
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

