import { useEffect } from 'react';
import styles from './PlanetInfoModal.module.scss';

interface PlanetInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMoonFollow?: (moonName: string) => void; // Added moon follow handler
    planetData: {
        name: string;
        type: string;
        planetType?: string;
        size: number;
        dist: number;
        speed: number;
        info: string;
        discoveryYear: string;
        composition?: string;
        temperature?: string;
        moons?: Array<{
            name: string;
            size: number;
            dist: number;
            speed: number;
            info: string;
        }>;
    } | null;
}

const PlanetInfoModal = ({ isOpen, onClose, onMoonFollow, planetData }: PlanetInfoModalProps) => {
    // Fonction de traduction des noms de planètes en français
    const translatePlanetName = (planetName: string): string => {
        const translations: { [key: string]: string } = {
            'Mercury': 'Mercure',
            'Venus': 'Vénus',
            'Earth': 'Terre',
            'Mars': 'Mars',
            'Jupiter': 'Jupiter',
            'Saturn': 'Saturne',
            'Uranus': 'Uranus',
            'Neptune': 'Neptune',
            'Pluto': 'Pluton'
        };
        return translations[planetName] || planetName;
    };

    // Fonction pour formater la composition avec des lignes séparées
    const formatComposition = (composition: string) => {
        // Sépare les éléments par virgule et les affiche sur des lignes séparées
        return composition.split(', ').map((item, index) => (
            <span key={index} className={styles.compositionItem}>{item}</span>
        ));
    };

    // Fonction pour calculer la distance par rapport à la Terre
    const getDistanceFromEarth = (planetDistance: number): string => {
        const earthDistance = 30; // Distance de la Terre au Soleil en UA (valeurs du jeu)
        const distanceDiff = Math.abs(planetDistance - earthDistance);

        if (distanceDiff < 0.1) {
            return "0 UA";
        }

        // Distance moyenne Terre-Soleil réelle = 1 UA = 149.6 millions de km
        const distanceKm = distanceDiff * 149.6;

        return `${distanceDiff.toFixed(2)} UA (~${distanceKm.toFixed(1)}M km)`;
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !planetData) return null;

    // Calculate orbital period in real years based on distance
    // Distance réelle en UA pour chaque planète (vraies distances astronomiques)
    const realDistancesInAU: { [key: string]: number } = {
        'Mercury': 0.387,
        'Venus': 0.723,
        'Earth': 1.0,
        'Mars': 1.524,
        'Jupiter': 5.204,
        'Saturn': 9.582,
        'Uranus': 19.218,
        'Neptune': 30.110,
        'Pluto': 39.482
    };

    const realAU = realDistancesInAU[planetData.name] || (planetData.dist / 30);
    const orbitalPeriodYears = Math.sqrt(Math.pow(realAU, 3)); // Loi de Kepler : T² ∝ a³

    // Fonction pour formater la période orbitale avec années et mois
    const formatOrbitalPeriod = (years: number): string => {
        if (years < 1) {
            return `${Math.round(years * 365)} jours`;
        }

        const wholeYears = Math.floor(years);
        const months = Math.round((years - wholeYears) * 12);

        if (months === 0) {
            return `${wholeYears} an${wholeYears > 1 ? 's' : ''} terrestre${wholeYears > 1 ? 's' : ''}`;
        }

        return `${wholeYears} an${wholeYears > 1 ? 's' : ''} et ${months} mois terrestre${wholeYears > 1 ? 's' : ''}`;
    };

    const orbitalPeriod = formatOrbitalPeriod(orbitalPeriodYears);

    // Type labels
    const typeLabels = {
        'planet': 'PLANÈTE',
        'dwarf': 'PLANÈTE NAINE',
        'asteroid': 'ASTÉROÏDE',
        'tno': 'OBJET TRANSNEPTUNIEN'
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{translatePlanetName(planetData.name).toUpperCase()}</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
                        ✕
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.planetInfo}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Type:</span>
                            <div className={styles.compositionValue}>
                                <span className={styles.badge}>
                                    {typeLabels[planetData.type as keyof typeof typeLabels] || 'CORPS CÉLESTE'}
                                </span>
                                {planetData.planetType && (
                                    <span className={styles.compositionItem}>
                                        ({planetData.planetType === 'gazeuse' ? 'Gazeuse' : 'Tellurique'})
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.label}>Taille:</span>
                            <span className={styles.value}>{planetData.size}x Terre</span>
                        </div>

                        <div className={styles.distanceExplanation}>
                            <p>
                                <strong>Calcul des distances :</strong> 1 UA (Unité Astronomique) = 149.6 millions de km
                                (distance moyenne Terre-Soleil). Les distances affichées sont proportionnelles pour la visualisation.
                            </p>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.label}>Distance du Soleil:</span>
                            <div className={styles.compositionValue}>
                                <span className={styles.compositionItem}>{(planetData.dist / 30).toFixed(2)} UA</span>
                                <span className={styles.compositionItem}>(~{((planetData.dist / 30) * 149.6).toFixed(1)}M km)</span>
                            </div>
                        </div>

                        {planetData.name !== 'Earth' && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Distance de la Terre:</span>
                                <div className={styles.compositionValue}>
                                    {getDistanceFromEarth(planetData.dist).split(', ').map((item, index) => (
                                        <span key={index} className={styles.compositionItem}>{item}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={styles.infoRow}>
                            <span className={styles.label}>Période orbitale:</span>
                            <div className={styles.compositionValue}>
                                <span className={styles.compositionItem}>{orbitalPeriod}</span>
                            </div>
                        </div>

                        {planetData.temperature && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Température:</span>
                                <span className={styles.value}>{planetData.temperature}</span>
                            </div>
                        )}

                        <div className={styles.infoRow}>
                            <span className={styles.label}>Découverte:</span>
                            <span className={styles.value}>{planetData.discoveryYear}</span>
                        </div>

                        {planetData.composition && (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Composition:</span>
                                <div className={styles.compositionValue}>
                                    {formatComposition(planetData.composition)}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.description}>
                        <h3>Description</h3>
                        {planetData.info.split('\n\n').map((paragraph, index) => (
                            <p key={index}>
                                {paragraph.trim()}
                            </p>
                        ))}
                    </div>

                    {planetData.name === 'Mercury' && (
                        <div className={styles.discoverySection}>
                            <h3>Historique de la découverte</h3>
                            <p>Mercure n'a pas de découvreur officiel, car elle était déjà connue dans l'Antiquité.</p>
                            <p>Comme elle est visible à l'œil nu (près du Soleil, juste avant l'aube ou après le coucher du Soleil), les civilisations anciennes l'ont observée très tôt - bien avant l'invention du télescope.</p>
                            <p>Les Babyloniens, vers 1000 av. J.-C., la connaissaient déjà et la notaient sur leurs tablettes d'argile.</p>
                            <p>Les Grecs puis les Romains ont ensuite repris ces observations, lui donnant des noms issus de leur mythologie.</p>
                        </div>
                    )}

                    {planetData.name === 'Venus' && (
                        <div className={styles.discoverySection}>
                            <h3>Historique de la découverte</h3>
                            <p>Vénus n'a pas de date de découverte précise, car elle était déjà connue depuis l'Antiquité et observée à l'œil nu par les civilisations babylonienne, égyptienne, grecque et romaine.</p>
                            <p>Les anciens croyaient même qu'il s'agissait de deux astres différents : Phosphoros (ou Éosphoros) quand elle apparaissait le matin avant le Soleil, et Hespéros quand elle apparaissait le soir après le coucher du Soleil.</p>
                            <p>Les Grecs ont fini par comprendre qu'il s'agissait de la même planète. Les Romains l'ont ensuite appelée Vénus, du nom de la déesse de l'amour et de la beauté, en raison de sa brillance exceptionnelle dans le ciel.</p>
                            <p>C'est d'ailleurs l'objet le plus lumineux du ciel nocturne après la Lune, ce qui lui a valu le surnom d'« étoile du berger ».</p>
                        </div>
                    )}

                    {planetData.name === 'Earth' && (
                        <div className={styles.discoverySection}>
                            <h3>Historique de la découverte</h3>
                            <p>Connue depuis la préhistoire, la Terre est notre planète d'origine et n'a donc pas de découvreur.</p>
                            <p>Longtemps considérée comme le centre de l'Univers, elle a révélé sa véritable place grâce aux travaux de Copernic et Galilée, qui ont démontré qu'elle tourne autour du Soleil.</p>
                            <p>Selon les modèles actuels, la Terre serait née il y a environ 4,5 milliards d'années d'une collision géante avec la proto-planète Théia, événement à l'origine de la formation de la Lune.</p>
                        </div>
                    )}

                    {planetData.name === 'Mars' && (
                        <div className={styles.discoverySection}>
                            <h3>Historique de la découverte</h3>
                            <p>Connue depuis la plus haute Antiquité, Mars est visible à l'œil nu dans le ciel nocturne et se distingue par sa brillance rougeâtre.</p>
                            <p>Les civilisations babyloniennes, égyptiennes, grecques et romaines l'observaient déjà, la liant à la guerre et à la force en raison de sa couleur de sang.</p>
                            <p>Les Romains lui ont donné le nom de Mars, le dieu de la guerre, équivalent du dieu Arès chez les Grecs.</p>
                            <p>Grâce aux télescopes, l'étude de Mars s'est intensifiée à partir du XVIIᵉ siècle, révélant ses calottes polaires et alimentant les premières théories sur une vie extraterrestre.</p>
                        </div>
                    )}

                    {planetData.name === 'Jupiter' && (
                        <div className={styles.discoverySection}>
                            <h3>Historique de la découverte</h3>
                            <p>Visible à l'œil nu, Jupiter est connue depuis la plus haute Antiquité et observée par les civilisations babylonienne, grecque et romaine.</p>
                            <p>Son éclat et sa lente progression dans le ciel lui ont valu d'être associée au roi des dieux, d'où son nom : Jupiter, l'équivalent romain de Zeus chez les Grecs.</p>
                            <p>En 1610, Galilée fut le premier à l'observer au télescope et à découvrir ses quatre plus grandes lunes — Io, Europe, Ganymède et Callisto — appelées aujourd'hui lunes galiléennes.</p>
                            <p>Cette découverte marqua un tournant majeur : elle démontra que tous les astres ne tournent pas autour de la Terre, soutenant ainsi la théorie héliocentrique de Copernic.</p>
                        </div>
                    )}

                    {planetData.name === 'Saturn' && (
                        <div className={styles.discoverySection}>
                            <h3>Historique de la découverte</h3>
                            <p>Visible à l'œil nu, Saturne est connue depuis la plus haute Antiquité.</p>
                            <p>Les Babyloniens et les Grecs anciens l'observaient déjà, fascinés par son éclat doré et son mouvement lent à travers le ciel.</p>
                            <p>Les Romains l'associèrent à Saturnus, le dieu du temps et des récoltes, équivalent du dieu grec Cronos, père de Jupiter (Zeus).</p>
                            <p>En 1610, Galilée fut le premier à l'observer au télescope : il distingua des "oreilles" autour de la planète sans comprendre qu'il s'agissait d'anneaux.</p>
                            <p>Quelques décennies plus tard, en 1655, Christiaan Huygens identifia clairement ces structures comme un système d'anneaux entourant la planète, marquant une étape majeure de l'histoire de l'astronomie.</p>
                        </div>
                    )}
                    {planetData.name === 'Uranus' && (
                        <div className={styles.discoverySection}>
                            <h3>Historique de la découverte</h3>
                            <p>Uranus fut découverte le 13 mars 1781 par l'astronome britannique William Herschel, alors qu'il observait le ciel depuis son jardin à Bath, en Angleterre.</p>
                            <p>Il pensait d'abord avoir trouvé une comète, mais les calculs d'orbite montrèrent qu'il s'agissait en réalité d'une nouvelle planète — la première jamais découverte à l'aide d'un télescope.</p>
                            <p>Cette découverte historique repoussa les frontières connues du Système solaire, qui ne comptait jusque-là que six planètes.</p>
                            <p>Herschel proposa de la nommer "Georgium Sidus" (l'étoile de George) en hommage au roi George III, mais les astronomes adoptèrent finalement le nom d'Uranus, le dieu grec du ciel, pour rester fidèle à la tradition mythologique.</p>
                        </div>
                    )}
                    {planetData.name === 'Neptune' && (
                        <div className={styles.discoverySection}>
                            <h3>Historique de la découverte</h3>
                            <p>Neptune fut découverte en 1846 grâce aux calculs mathématiques de l'astronome français Urbain Le Verrier, qui prédit sa position en étudiant les irrégularités de l'orbite d'Uranus.</p>
                            <p>Indépendamment, l'astronome britannique John Couch Adams arriva aux mêmes conclusions, mais c'est l'astronome allemand Johann Gottfried Galle qui confirma l'existence de la planète au télescope le 23 septembre 1846, à seulement un degré de la position prédite par Le Verrier.</p>
                            <p>Cette découverte fit sensation : ce fut la première planète découverte grâce aux mathématiques, et non par simple observation du ciel.</p>
                            <p>Elle reçut le nom de Neptune, en hommage au dieu romain des océans, une référence évidente à sa couleur bleue profonde.</p>
                        </div>
                    )}
                    {planetData.name === 'Pluto' && (
                        <div className={styles.discoverySection}>
                            <h3>Historique de la découverte</h3>
                            <p>Pluton fut découverte le 18 février 1930 par l'astronome américain Clyde Tombaugh, à l'observatoire Lowell en Arizona (États-Unis).</p>
                            <p>Cette découverte résultait des recherches initiées par Percival Lowell, qui avait prédit l'existence d'une neuvième planète en étudiant les perturbations dans les orbites d'Uranus et de Neptune.</p>
                            <p>Longtemps considérée comme la neuvième planète du Système solaire, Pluton a été reclassée en planète naine le 24 août 2006 par l'Union astronomique internationale (UAI).</p>
                            <p>Cette décision s'appuie sur le fait qu'elle n'a pas "nettoyé" son orbite des autres objets de la ceinture de Kuiper, contrairement aux planètes principales.</p>
                            <p>Son nom, Pluton, a été proposé par une jeune Anglaise de 11 ans, Venetia Burney, en référence au dieu romain des Enfers, symbole du froid et de l'obscurité.</p>
                        </div>
                    )}

                    {planetData.moons && planetData.moons.length > 0 && (
                        <div className={styles.moonsSection}>
                            <h3>Satellites naturels ({planetData.moons.length})</h3>
                            <p className={styles.moonsExplanation}>
                                Les distances sont exprimées en rayons de la planète parente.
                                Par exemple, si un satellite est à 2 rayons, il orbite à 2 fois le rayon de la planète.
                            </p>
                            <div className={styles.moonsList}>
                                {planetData.moons.map((moon, index) => (
                                    <div key={index} className={styles.moonItem}>
                                        <div className={styles.moonHeader}>
                                            <div className={styles.moonName}>🌙 {moon.name}</div>
                                            {onMoonFollow && (
                                                <button
                                                    className={styles.followButton}
                                                    onClick={() => onMoonFollow(moon.name)}
                                                    title={`Suivre ${moon.name}`}
                                                >
                                                    Suivre
                                                </button>
                                            )}
                                        </div>
                                        <div className={styles.moonInfo}>
                                            Taille: {moon.size}x Terre | Distance: {moon.dist} rayons planétaires
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanetInfoModal;
