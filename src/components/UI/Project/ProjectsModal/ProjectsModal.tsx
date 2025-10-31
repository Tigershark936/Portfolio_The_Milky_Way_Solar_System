import { useState, useEffect } from 'react';
import styles from './ProjectsModal.module.scss';

type GitHubRepo = {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    npm_url?: string | null;
    language: string | null;
    stars: number;
    updated_at: string;
};

type ProjectsModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

// Fonction pour personnaliser les titres des projets
const getDisplayName = (repoName: string): string => {
    const customTitles: { [key: string]: string } = {
        'Portfolio_The_Milky_Way_Solar_System': 'Portfolio Solaire',
        'modal-library': 'Modal Library',
        'SportSee_Developpez_un_tableau_de_bord_d-analytics_avec_React': 'SportSee',
        'WealthHealth_Faites_passer_une_librairie_jQuery_vers_React': 'Wealth Health',
        'ArgentBank_Utilisez_une_API_pour_un_compte_utilisateur_bancaire_avec_React': 'Argent Bank',
        'Kasa_Developpez_une_application_Web_avec_React_et_React_Router': 'Kasa',
        'Les_petits_plats_D-veloppez_un_algorithme_de_recherche_en_JavaScript': 'Les Petits Plats',
        'Billed-app-FR-Front-End_Debuggez_et_testez_un_SaaS_RH': 'Billed'
    };

    // Retourne le titre personnalisé ou le nom du repo par défaut
    return customTitles[repoName] || repoName;
};

// Fonction pour personnaliser les descriptions des projets
const getDisplayDescription = (repoName: string, defaultDescription: string | null): string => {
    const customDescriptions: { [key: string]: string } = {
        'Portfolio_The_Milky_Way_Solar_System': 'Système solaire 3D interactif avec React, Three.js et TypeScript. Explorez 9 planètes, 24 lunes et 3 ceintures d\'astéroïdes dans un environnement spatial immersif.',
        'modal-library': 'Une bibliothèque React de modals réutilisables et personnalisables pour vos applications web.',
        'SportSee_Developpez_un_tableau_de_bord_d-analytics_avec_React': 'Tableau de bord d\'analytics pour suivre les performances sportives en temps réel.',
        'WealthHealth_Faites_passer_une_librairie_jQuery_vers_React': 'Migration d\'une application jQuery vers React avec une architecture moderne.',
        'ArgentBank_Utilisez_une_API_pour_un_compte_utilisateur_bancaire_avec_React': 'Application bancaire avec authentification et gestion de comptes utilisateurs.',
        'Kasa_Developpez_une_application_Web_avec_React_et_React_Router': 'Application de location immobilière avec recherche et filtres avancés.',
        'Les_petits_plats_D-veloppez_un_algorithme_de_recherche_en_JavaScript': 'Algorithme de recherche intelligent pour des recettes culinaires.',
        'Billed-app-FR-Front-End_Debuggez_et_testez_un_SaaS_RH': 'Application SaaS RH pour la gestion des notes de frais et factures.'
    };

    // Retourne la description personnalisée ou la description par défaut
    return customDescriptions[repoName] || defaultDescription || '';
};

const ProjectsModal = ({ isOpen, onClose }: ProjectsModalProps) => {
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && repos.length === 0) {
            fetchRepos();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    const fetchRepos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://api.github.com/users/Tigershark936/repos?sort=updated&per_page=10');
            if (!response.ok) throw new Error('Failed to fetch repositories');

            const data = await response.json();
            const formattedRepos = data.map((repo: any) => {
                // Vérifier s'il s'agit d'un package npm
                const isNpmPackage = repo.name === 'modal-library';
                const npm_url = isNpmPackage ? 'https://www.npmjs.com/package/@adhrnet/modal' : null;

                // Ajouter les URLs de démo si non définies dans GitHub
                let homepage = repo.homepage;
                if (!homepage && repo.name === 'Portfolio_The_Milky_Way_Solar_System') {
                    homepage = 'https://portfolio-the-milky-way-solar-system.netlify.app/';
                } else if (!homepage && repo.name.toLowerCase().includes('sportsee')) {
                    homepage = 'https://sportsee-tsk.netlify.app/';
                }

                return {
                    id: repo.id,
                    name: repo.name,
                    full_name: repo.full_name,
                    description: repo.description,
                    html_url: repo.html_url,
                    homepage: homepage,
                    npm_url: npm_url,
                    language: repo.language,
                    stars: repo.stargazers_count,
                    updated_at: repo.updated_at,
                };
            });

            // Filtrer les projets à exclure (ajoutez les noms ici)
            const filteredRepos = formattedRepos.filter((repo: GitHubRepo) => {
                const excludedProjects = [
                    'Testez_vos_competences_-_les_algorithmes_en_JavaScript',
                    'Billed-app-FR-Back-End_Debuggez_et_testez_un_SaaS_RH'
                ]; // Ajoutez les projets à exclure
                return !excludedProjects.includes(repo.name);
            });

            setRepos(filteredRepos);
        } catch (err) {
            setError('Erreur lors du chargement des projets');
            console.error('Error fetching repos:', err);
        } finally {
            setLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Mes Projets</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Fermer la modale info">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.closeIcon} aria-hidden="true">
                            <line x1="4.5" y1="4.5" x2="15.5" y2="15.5" stroke="#ff4444" strokeWidth="2.2" strokeLinecap="round" />
                            <line x1="15.5" y1="4.5" x2="4.5" y2="15.5" stroke="#ff4444" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {loading && (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Chargement des projets...</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.error}>
                            <p>{error}</p>
                            <a
                                href="https://github.com/Tigershark936"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.githubLink}
                            >
                                Voir mon GitHub →
                            </a>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className={styles.projectsGrid}>
                            {repos.map((repo) => {
                                // Simplifier le nom d'image pour les projets connus
                                let imageName;
                                if (repo.name === 'Portfolio_The_Milky_Way_Solar_System') {
                                    imageName = 'Portfolio-The_Milky_Way_Solar_System';
                                } else if (repo.name === 'modal-library') {
                                    imageName = 'adhrnet-modal';
                                } else if (repo.name.toLowerCase().includes('sportsee')) {
                                    imageName = 'sportsee';
                                } else if (repo.name.toLowerCase().includes('wealthhealth')) {
                                    imageName = 'wealth-health';
                                } else if (repo.name.toLowerCase().includes('argentbank')) {
                                    imageName = 'argentbank';
                                } else if (repo.name.toLowerCase().includes('kasa')) {
                                    imageName = 'kasa';
                                } else if (repo.name.toLowerCase().includes('petits') || repo.name.toLowerCase().includes('plats')) {
                                    imageName = 'les-petits-plats';
                                } else if (repo.name.toLowerCase().includes('billed') && !repo.name.toLowerCase().includes('back-end')) {
                                    imageName = 'billed';
                                } else {
                                    imageName = repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                                }
                                const imagePath = `/projects/${imageName}.jpg`;

                                return (
                                    <div key={repo.id} className={styles.projectCard}>
                                        <div className={styles.projectImage}>
                                            <img
                                                src={imagePath}
                                                alt={repo.name}
                                                onError={(e) => {
                                                    // Fallback vers le placeholder si l'image n'existe pas
                                                    const target = e.currentTarget as HTMLImageElement;
                                                    target.src = '';
                                                    target.style.display = 'none';
                                                    const placeholder = target.nextElementSibling as HTMLDivElement;
                                                    if (placeholder) {
                                                        placeholder.style.display = 'flex';
                                                    }
                                                }}
                                            />
                                            <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
                                                <span className={styles.imageIcon}>🖥️</span>
                                                <p>Image du projet</p>
                                            </div>
                                        </div>
                                        <div className={styles.projectContent}>
                                            <h3 className={styles.projectTitle}>
                                                {getDisplayName(repo.name)}
                                            </h3>
                                            {(() => {
                                                const description = getDisplayDescription(repo.name, repo.description);
                                                return description && (
                                                    <p className={styles.projectDescription}>
                                                        {description}
                                                    </p>
                                                );
                                            })()}
                                            <div className={styles.projectButtons}>
                                                <a
                                                    href={repo.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.githubButton}
                                                >
                                                    <svg className={styles.githubIcon} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                    GitHub
                                                </a>
                                                {repo.homepage && repo.homepage.trim() !== '' && (
                                                    <a
                                                        href={repo.homepage}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.demoButton}
                                                    >
                                                        <svg className={styles.demoIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                            <polyline points="15 3 21 3 21 9"></polyline>
                                                            <line x1="10" y1="14" x2="21" y2="3"></line>
                                                        </svg>
                                                        Démo
                                                    </a>
                                                )}
                                                {repo.npm_url && (
                                                    <a
                                                        href={repo.npm_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.npmButton}
                                                    >
                                                        <svg className={styles.npmIcon} width="18" height="18" viewBox="0 0 18 7" fill="currentColor">
                                                            <path d="M0 0v6.5h5v-6h3v6h2.5v-7z" />
                                                        </svg>
                                                        NPM
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className={styles.modalFooter}>
                        <a
                            href="https://github.com/Tigershark936"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewAllButton}
                        >
                            <span>🚀</span>
                            Voir tous mes projets sur GitHub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsModal;

