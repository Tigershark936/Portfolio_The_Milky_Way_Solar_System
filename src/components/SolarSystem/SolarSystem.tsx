import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import styles from './SolarSystem.module.scss';
import Sun from '../Sun/Sun';
import Planet from '../Planet/Planet';
import Nebula from '../Nebula/Nebula';
import TwinklingStars from '../TwinklingStars/Stars';
import Orbit from '../Orbit/Orbit';
import Menu from '../UI/Menu/Menu';
import CameraControls from '../UI/Camera/CameraControls';
import PlanetSelector from '../UI/Selectors/PlanetSelector';
import PlanetFollower from '../UI/Camera/PlanetFollower';
import LabelManager from '../UI/Labels/LabelManager';
import ProjectsButton from '../UI/Project/ProjectsButton/ProjectsButton';
import AboutButton from '../UI/About/AboutButton/AboutButton';
import ContactButton from '../UI/Contact/ContactButton/ContactButton';
import PlanetInfoModal from '../UI/PlanetInfo/PlanetInfoModal';
import MoonFollower from '../UI/Camera/MoonFollower';
import type { Planet as PlanetType } from '../../types/Planet';

// Planètes avec couleurs NASA officielles, distances bien espacées et tailles ajustées
const planets: PlanetType[] = [
    { name: 'Mercury', distance: 16, size: 0.23, color: '#B8860B', speed: 4.15, angle: 0 }, // Couleur plus visible (dark goldenrod)
    { name: 'Venus', distance: 22, size: 0.57, color: '#ffc649', speed: 1.62, angle: 0 }, // 0.95 * 0.6
    { name: 'Earth', distance: 31, size: 0.3, color: '#6b93d6', speed: 1, angle: 0 }, // 1.0 * 0.3
    { name: 'Mars', distance: 40, size: 0.32, color: '#cd5c5c', speed: 0.53, angle: 0 }, // 0.53 * 0.6
    { name: 'Jupiter', distance: 60, size: 8.97, color: '#d8ca9d', speed: 0.084, angle: 0 }, // 11.21 * 0.8
    { name: 'Saturn', distance: 85, size: 6.62, color: '#fad5a5', speed: 0.034, angle: 0 }, // 9.45 * 0.7
    { name: 'Uranus', distance: 110, size: 2.01, color: '#4fd0e7', speed: 0.012, angle: 0 }, // 4.01 * 0.5
    { name: 'Neptune', distance: 135, size: 1.94, color: '#4b70dd', speed: 0.006, angle: 0 }, // 3.88 * 0.5
    { name: 'Pluto', distance: 160, size: 0.14, color: '#8c7853', speed: 0.01, angle: 0 }, // 0.18 * 0.8
];

const SolarSystem = () => {
    const [showPlanetNames, setShowPlanetNames] = useState(false); // Désactivé par défaut
    const [showMoonNames, setShowMoonNames] = useState(false);
    const [showOrbits, setShowOrbits] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 63.16, z: 126.32 });
    const [activeCameraPreset, setActiveCameraPreset] = useState<'overview' | 'close' | 'far' | 'top' | null>('overview');
    const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
    const [isPlanetInfoModalOpen, setIsPlanetInfoModalOpen] = useState(false);
    const [selectedPlanetData, setSelectedPlanetData] = useState<any>(null);
    const [selectedMoon, setSelectedMoon] = useState<string | null>(null);
    const [isSunHovered, setIsSunHovered] = useState(false);
    const controlsRef = useRef<any>(null);

    const handleTogglePlanetNames = () => {
        setShowPlanetNames(!showPlanetNames);
    };

    const handleToggleMoonNames = () => {
        setShowMoonNames(!showMoonNames);
    };

    const handleToggleOrbits = () => {
        setShowOrbits(!showOrbits);
    };

    const handleSpeedChange = (speed: number) => {
        setAnimationSpeed(speed);
    };

    const handleCameraReset = () => {
        setCameraPosition({ x: 0, y: 63.16, z: 126.32 });
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    // Données du Soleil
    const sunDetails = {
        name: 'Sun',
        type: 'star',
        size: 15,
        dist: 0,
        speed: 0,
        info: 'Le Soleil est l\'étoile au centre de notre Système solaire, une gigantesque sphère de plasma composée principalement d\'hydrogène et d\'hélium.\n\nIl produit son énergie par fusion nucléaire dans son cœur, transformant l\'hydrogène en hélium et libérant une quantité colossale de lumière et de chaleur.\n\nAvec un diamètre d\'environ 1,4 million de kilomètres, il concentre 99,86 % de la masse totale du Système solaire.\n\nSa surface visible, la photosphère, atteint près de 5 500 °C, tandis que son noyau dépasse les 15 millions de degrés Celsius.\n\nLe Soleil influence l\'ensemble des planètes par sa gravité, son rayonnement et son vent solaire, jouant un rôle essentiel dans la stabilité du Système solaire et rendant la vie possible sur Terre.',
        discoveryYear: 'Antiquité',
        composition: '74,9% hydrogène (H), 23,8% hélium (He), 1,3% éléments lourds',
        temperature: 'Surface : ~5 500 °C | Cœur : ~15 000 000 °C'
    };

    const handleSunClick = () => {
        // Ouvrir la modal avec les informations du Soleil
        setSelectedPlanetData(sunDetails);
        setIsPlanetInfoModalOpen(true);
        // Remettre la caméra à la position de base
        if (controlsRef.current) {
            const camera = controlsRef.current.object;
            camera.position.set(0, 63.16, 126.32);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
            setCameraPosition({ x: 0, y: 63.16, z: 126.32 });
        }
        // Remettre le preset à overview
        setActiveCameraPreset('overview');
        // Désélectionner toute planète/lune
        setSelectedPlanet(null);
        setSelectedMoon(null);
    };

    const handleCameraPreset = (preset: 'overview' | 'close' | 'far' | 'top') => {
        if (!controlsRef.current) return;

        const camera = controlsRef.current.object;

        switch (preset) {
            case 'overview':
                camera.position.set(0, 63.16, 126.32);
                break;
            case 'close':
                camera.position.set(0, 40, 80);
                break;
            case 'far':
                camera.position.set(0, 147.58, 295.16);
                break;
            case 'top':
                camera.position.set(0, 330, 0);
                break;
        }

        setActiveCameraPreset(preset);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
    };


    const handlePlanetSelect = (planetName: string | null) => {
        setSelectedPlanet(planetName);
        // Désélectionner la lune quand on sélectionne une planète
        setSelectedMoon(null);
        // Ouvrir la modal avec les infos de la planète quand on sélectionne via le sélecteur
        if (planetName) {
            handlePlanetClick(planetName);
        } else {
            // Si on désélectionne, fermer la modal et remettre la caméra en vue libre
            handleClosePlanetInfoModal();
        }
    };

    // Données détaillées des planètes (inspirées du code de référence)
    const planetDetails = {
        'Mercury': {
            name: 'Mercury',
            type: 'planet',
            planetType: 'tellurique',
            size: 0.23,
            dist: 16,
            speed: 4.15,
            info: 'Mercure est la planète la plus proche du Soleil et aussi la plus petite du Système solaire.\n\nSa surface grêlée de cratères rappelle celle de la Lune, témoin d\'un passé de bombardements intenses.\n\nPrivée d\'atmosphère réelle, elle ne retient ni chaleur ni protection contre les rayonnements solaires : les températures varient brutalement, passant d\'environ -180°C la nuit à +430°C le jour.\n\nSa rotation lente (un jour mercurien dure près de 59 jours terrestres) et son orbite rapide (elle tourne autour du Soleil en seulement 88 jours) en font un monde de contrastes extrêmes.\n\nMercure ne possède ni lunes ni anneaux.',
            discoveryYear: 'Antiquité',
            composition: 'Sodium (traces), Potassium (traces), Argon (traces)',
            temperature: '-180°C à +430°C',
            moons: []
        },
        'Venus': {
            name: 'Venus',
            type: 'planet',
            planetType: 'tellurique',
            size: 0.57,
            dist: 22,
            speed: 1.62,
            info: 'Vénus est la deuxième planète la plus proche du Soleil et la plus chaude du Système solaire, avec des températures atteignant environ 462°C en surface.\n\nSon atmosphère dense et toxique, composée à plus de 96% de dioxyde de carbone, emprisonne la chaleur par un effet de serre extrême.\n\nRecouverte d\'épais nuages d\'acide sulfurique, Vénus reflète fortement la lumière du Soleil, ce qui la rend très brillante dans le ciel, souvent appelée « l\'étoile du berger ».\n\nSa rotation rétrograde (elle tourne dans le sens inverse des autres planètes) et son jour plus long que son année en font un monde à la fois fascinant et hostile.',
            discoveryYear: 'Antiquité',
            composition: '96% CO₂ (dioxyde de carbone), 3% N₂ (azote), 0,2% SO₂ (dioxyde de soufre)',
            temperature: '462°C (moyenne)',
            moons: []
        },
        'Earth': {
            name: 'Earth',
            type: 'planet',
            planetType: 'tellurique',
            size: 0.6,
            dist: 30,
            speed: 1,
            info: 'La Terre est la troisième planète à partir du Soleil et la seule connue à abriter la vie.\n\nEnviron 71% de sa surface est recouverte d\'océans, tandis que le reste forme les continents et les calottes polaires.\n\nElle possède une atmosphère riche en azote et en oxygène, qui régule la température, protège des rayonnements solaires et rend la vie possible.\n\nLa Terre tourne sur elle-même en 24 heures et effectue sa révolution autour du Soleil en 365 jours.\n\nElle est accompagnée d\'un unique satellite naturel, la Lune, qui influence les marées et stabilise son axe de rotation.',
            discoveryYear: 'N/A',
            composition: '78% N₂ (azote), 21% O₂ (oxygène), 0,9% Ar (argon)',
            temperature: '15°C (moyenne)',
            moons: [
                { name: 'Lune', size: 0.16, dist: 2.5, speed: 0.037, info: 'Seul satellite naturel de la Terre. Formé il y a 4,5 milliards d\'années.' }
            ]
        },
        'Mars': {
            name: 'Mars',
            type: 'planet',
            planetType: 'tellurique',
            size: 0.32,
            dist: 45,
            speed: 0.53,
            info: 'Surnommée la planète rouge à cause de la rouille (oxyde de fer) qui colore sa surface, Mars est la quatrième planète du Système solaire.\n\nElle abrite le plus grand volcan connu, Olympus Mons, haut de près de 22 km, et le plus vaste canyon, Valles Marineris, long d\'environ 4 000 km.\n\nSon atmosphère, très fine et froide, est composée majoritairement de dioxyde de carbone.\n\nLes calottes de glace à ses pôles et les traces d\'anciens lits de rivières suggèrent qu\'elle a jadis abrité de l\'eau liquide, nourrissant l\'espoir d\'une vie passée.',
            discoveryYear: 'Antiquité',
            composition: '95% CO₂ (dioxyde de carbone), 2,6% N₂ (azote), 1,6% Ar (argon)',
            temperature: '-65°C (moyenne)',
            moons: [
                { name: 'Phobos', size: 0.03, dist: 1.5, speed: 0.32, info: 'Plus grande lune de Mars. Orbite Mars 3 fois par jour.' },
                { name: 'Deimos', size: 0.02, dist: 2.2, speed: 0.08, info: 'Plus petite lune extérieure de Mars. Met 30 heures pour orbiter Mars.' }
            ]
        },
        'Jupiter': {
            name: 'Jupiter',
            type: 'planet',
            planetType: 'gazeuse',
            size: 1.2,
            dist: 75,
            speed: 0.084,
            info: 'Jupiter est la cinquième planète du Système solaire et la plus grande planète du Système solaire, une géante gazeuse principalement composée d\'hydrogène et d\'hélium.\n\nSa caractéristique la plus célèbre est la Grande Tache Rouge, une immense tempête qui fait rage depuis des siècles et dont la taille dépasse celle de la Terre.\n\nJupiter possède un système d\'anneaux fins et au moins 95 lunes connues, dont les quatre principales, Io, Europe, Ganymède et Callisto, furent découvertes par Galilée en 1610.\n\nSon champ magnétique est le plus puissant du Système solaire, et sa taille colossale influence l\'orbite de nombreuses autres planètes et astéroïdes.',
            discoveryYear: 'Antiquité',
            composition: '89% H₂ (hydrogène), 10% He (hélium), 0,3% CH₄ (méthane)',
            temperature: '-110°C (atmosphère)',
            moons: [
                { name: 'Io', size: 0.09, dist: 3.5, speed: 0.56, info: 'Corps le plus volcaniquement actif du système solaire.' },
                { name: 'Europa', size: 0.08, dist: 4.2, speed: 0.28, info: 'Lune recouverte de glace avec un océan souterrain. Potentiel pour la vie.' },
                { name: 'Ganymede', size: 0.13, dist: 5.1, speed: 0.14, info: 'Plus grande lune du système solaire. Possède son propre champ magnétique.' },
                { name: 'Callisto', size: 0.12, dist: 6.0, speed: 0.06, info: 'Corps le plus cratérisé du système solaire.' }
            ]
        },
        'Saturn': {
            name: 'Saturn',
            type: 'planet',
            planetType: 'gazeuse',
            size: 1.02,
            dist: 95,
            speed: 0.034,
            info: 'Saturne est la sixième planète à partir du Soleil et la deuxième plus grande du Système solaire, après Jupiter.\n\nElle est célèbre pour son magnifique système d\'anneaux, composés de milliards de particules de glace et de roche, visibles même depuis la Terre avec un petit télescope.\n\nComposée principalement d\'hydrogène et d\'hélium, Saturne est si peu dense qu\'elle flotterait dans l\'eau si un océan assez grand existait.\n\nElle possède 146 satellites naturels connus, dont une vingtaine de lunes majeures, comme Titan, Rhéa, Encelade et Lapetus, et plus de 120 petits satellites irréguliers capturés par sa gravité.\n\nCertaines de ces lunes, notamment Encelade et Titan, intriguent les scientifiques pour leur potentiel d\'abriter la vie.',
            discoveryYear: 'Antiquité',
            composition: '96% H₂ (hydrogène), 3% He (hélium), 0,4% CH₄ (méthane)',
            temperature: '-140°C (atmosphère)',
            moons: [
                { name: 'Mimas', size: 0.06, dist: 4.5, speed: 0.94, info: 'Lune connue pour son énorme cratère Herschel. Surface très cratérisée.' },
                { name: 'Enceladus', size: 0.065, dist: 6.5, speed: 0.73, info: 'Geysers de glace du pôle sud. Océan souterrain et possiblement habitable.' },
                { name: 'Tethys', size: 0.075, dist: 8.0, speed: 0.41, info: 'Grand cratère Odysseus et grande vallée Ithaca Chasma.' },
                { name: 'Dione', size: 0.085, dist: 10.0, speed: 0.26, info: 'Surface glacée avec canyons et falaises.' },
                { name: 'Rhea', size: 0.095, dist: 12.5, speed: 0.16, info: 'Seconde plus grande lune de Saturne avec des marques blanchâtres.' },
                { name: 'Titan', size: 0.16, dist: 15.0, speed: 0.063, info: 'Plus grande lune de Saturne. Possède une atmosphère épaisse et des lacs de méthane liquide.' },
                { name: 'Hyperion', size: 0.045, dist: 17.0, speed: 0.95, info: 'Lune de forme irrégulière et très poreuse, orbite chaotique.' },
                { name: 'Lapetus', size: 0.08, dist: 22.0, speed: 0.08, info: 'Lune bicolore avec une face sombre et une face claire. Crête équatoriale unique.' },
                { name: 'Phoebe', size: 0.055, dist: 30.0, speed: 0.35, info: 'Orbite rétrograde et surface très sombre. Probable astéroïde capturé.' }
            ]
        },
        'Uranus': {
            name: 'Uranus',
            type: 'planet',
            planetType: 'gazeuse',
            size: 0.72,
            dist: 115,
            speed: 0.012,
            info: 'Uranus est la septième planète à partir du Soleil et l\'une des deux géantes de glace du Système solaire, avec Neptune.\n\nElle est unique par son inclinaison axiale extrême de 98°, ce qui fait qu\'elle semble tourner sur le côté : ses pôles pointent presque vers le Soleil.\n\nComposée principalement d\'hydrogène, d\'hélium et de méthane, c\'est ce dernier gaz qui lui donne sa teinte bleu-vert caractéristique.\n\nUranus possède un système d\'anneaux sombres et discrets, ainsi que 28 lunes connues, dont les plus importantes sont Titania, Oberon, Umbriel, Ariel et Miranda.\n\nSon atmosphère glaciale en fait l\'une des planètes les plus froides du Système solaire, avec des températures pouvant descendre jusqu\'à –224 °C.',
            discoveryYear: '1781',
            composition: '83% H₂ (hydrogène), 15% He (hélium), 2% CH₄ (méthane)',
            temperature: '-224°C',
            moons: [
                { name: 'Miranda', size: 0.04, dist: 1.8, speed: 0.67, info: 'Lune la plus inhabituelle avec des caractéristiques géologiques extrêmes.' }
            ]
        },
        'Neptune': {
            name: 'Neptune',
            type: 'planet',
            planetType: 'gazeuse',
            size: 0.7,
            dist: 135,
            speed: 0.006,
            info: 'Neptune est la huitième et dernière planète du Système solaire, une géante de glace au bleu profond, dû à la présence de méthane dans son atmosphère.\n\nC\'est la planète la plus venteuse connue, avec des rafales pouvant atteindre 2 100 km/h, bien plus rapides que sur Jupiter ou la Terre.\n\nComposée d\'hydrogène, d\'hélium, d\'eau, d\'ammoniac et de méthane, Neptune présente une météo extrême : de gigantesques tempêtes sombres y apparaissent et disparaissent régulièrement.\n\nElle possède des anneaux pâles et ténus, ainsi que 14 lunes connues, dont la plus grande, Triton, orbite dans le sens inverse de la rotation de la planète, suggérant qu\'elle fut capturée par sa gravité.',
            discoveryYear: '1846',
            composition: '80% H₂ (hydrogène), 19% He (hélium), 1,5% CH₄ (méthane)',
            temperature: '-200°C (atmosphère)',
            moons: [
                { name: 'Triton', size: 0.07, dist: 3.0, speed: 0.17, info: 'Plus grande lune de Neptune. Orbite rétrograde. Geysers d\'azote.' }
            ]
        },
        'Pluto': {
            name: 'Pluto',
            type: 'dwarf',
            planetType: 'tellurique',
            size: 0.14,
            dist: 160,
            speed: 0.01,
            info: 'Ancienne neuvième planète du Système solaire, Pluton est aujourd\'hui classée parmi les planètes naines.\n\nSituée dans la ceinture de Kuiper, elle suit une orbite très elliptique et inclinée, ce qui fait qu\'à certaines périodes, elle passe plus près du Soleil que Neptune.\n\nSa surface glacée est composée principalement de glace d\'azote, de méthane et de monoxyde de carbone, et présente une grande plaine d\'azote en forme de cœur, appelée Tombaugh Regio.\n\nPluton forme un système binaire avec sa lune principale, Charon, presque aussi grande qu\'elle : les deux astres tournent autour d\'un centre de gravité commun, situé en dehors de Pluton.\n\nElle possède aussi quatre autres petites lunes, Styx, Nix, Kerberos et Hydra, et reste un monde glacial mais complexe, où la mission New Horizons (NASA, 2015) a révélé une géologie surprenamment active.',
            discoveryYear: '1930',
            composition: 'Glace d\'azote (N₂), Méthane (CH₄), Monoxyde de carbone (CO)',
            temperature: '-230°C',
            moons: [
                { name: 'Charon', size: 0.12, dist: 1.8, speed: 0.16, info: 'Plus grande lune relative à sa planète parent. Verrouillée par les marées avec Pluton.' },
                { name: 'Styx', size: 0.04, dist: 4.0, speed: 0.12, info: 'La plus petite lune de Pluton, découverte en 2012 par Hubble.' },
                { name: 'Nix', size: 0.06, dist: 5.5, speed: 0.08, info: 'Lune de forme irrégulière, découverte en 2005.' },
                { name: 'Kerberos', size: 0.05, dist: 7.0, speed: 0.06, info: 'Lune sombre et irrégulière, découverte en 2011.' },
                { name: 'Hydra', size: 0.08, dist: 8.5, speed: 0.04, info: 'Plus grande lune après Charon, découverte en 2005.' }
            ]
        }
    };

    const handlePlanetClick = (planetName: string) => {
        const planetData = planetDetails[planetName as keyof typeof planetDetails];
        if (planetData) {
            setSelectedPlanetData(planetData);
            setIsPlanetInfoModalOpen(true);
            // Sélectionner la planète pour activer le suivi de caméra
            setSelectedPlanet(planetName);
            // Réinitialiser le preset car la caméra suit maintenant la planète
            setActiveCameraPreset(null);
        }
    };

    const handleClosePlanetInfoModal = () => {
        setIsPlanetInfoModalOpen(false);
        setSelectedPlanetData(null);
        // Ne pas désélectionner la planète pour que la caméra continue de la suivre
    };

    const handleMoonClick = (moonName: string) => {
        setSelectedMoon(moonName);
        setSelectedPlanet(null); // Désélectionner la planète quand on sélectionne une lune
        // Réinitialiser le preset car la caméra suit maintenant la lune
        setActiveCameraPreset(null);
        // Fermer la modal de la planète
        handleClosePlanetInfoModal();
    };

    return (
        <div className={styles.solarSystem}>
            <Menu
                showPlanetNames={showPlanetNames}
                showMoonNames={showMoonNames}
                showOrbits={showOrbits}
                onTogglePlanetNames={handleTogglePlanetNames}
                onToggleMoonNames={handleToggleMoonNames}
                onToggleOrbits={handleToggleOrbits}
            />
            <AboutButton />
            <ContactButton />
            <ProjectsButton />

            <CameraControls
                onSpeedChange={handleSpeedChange}
                onCameraReset={handleCameraReset}
                onCameraPreset={handleCameraPreset}
                activeCameraPreset={activeCameraPreset}
            />
            <PlanetSelector
                planets={planets}
                onPlanetSelect={handlePlanetSelect}
                selectedPlanet={selectedPlanet}
            />
            <Canvas
                camera={{ position: [cameraPosition.x, cameraPosition.y, cameraPosition.z], fov: 60 }}
                frameloop="always"
                dpr={[1, 2]}
            >
                <OrbitControls
                    ref={controlsRef}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={30}
                    maxDistance={330}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI}
                />
                <PlanetFollower
                    selectedPlanet={selectedPlanet}
                    planets={planets}
                    controlsRef={controlsRef}
                />
                <MoonFollower
                    selectedMoon={selectedMoon}
                    moons={[
                        { name: 'Lune', distance: 3, size: 0.27 * 0.3, speed: 0.3, angle: 0, parentPlanet: 'Earth' },
                        { name: 'Phobos', distance: 1.5, size: 0.03, speed: 0.32, angle: 0, parentPlanet: 'Mars' },
                        { name: 'Deimos', distance: 2.2, size: 0.02, speed: 0.08, angle: 0, parentPlanet: 'Mars' },
                        { name: 'Io', distance: 3.5, size: 0.09, speed: 0.56, angle: 0, parentPlanet: 'Jupiter' },
                        { name: 'Europa', distance: 4.2, size: 0.08, speed: 0.28, angle: 0, parentPlanet: 'Jupiter' },
                        { name: 'Ganymede', distance: 5.1, size: 0.13, speed: 0.14, angle: 0, parentPlanet: 'Jupiter' },
                        { name: 'Callisto', distance: 6.0, size: 0.12, speed: 0.06, angle: 0, parentPlanet: 'Jupiter' },
                        { name: 'Mimas', distance: 4.5, size: 0.06, speed: 0.94, angle: 0, parentPlanet: 'Saturn' },
                        { name: 'Enceladus', distance: 6.5, size: 0.065, speed: 0.73, angle: 0, parentPlanet: 'Saturn' },
                        { name: 'Tethys', distance: 8.0, size: 0.075, speed: 0.41, angle: 0, parentPlanet: 'Saturn' },
                        { name: 'Dione', distance: 10.0, size: 0.085, speed: 0.26, angle: 0, parentPlanet: 'Saturn' },
                        { name: 'Rhea', distance: 12.5, size: 0.095, speed: 0.16, angle: 0, parentPlanet: 'Saturn' },
                        { name: 'Titan', distance: 15.0, size: 0.16, speed: 0.063, angle: 0, parentPlanet: 'Saturn' },
                        { name: 'Hyperion', distance: 17.0, size: 0.045, speed: 0.95, angle: 0, parentPlanet: 'Saturn' },
                        { name: 'Lapetus', distance: 22.0, size: 0.08, speed: 0.08, angle: 0, parentPlanet: 'Saturn' },
                        { name: 'Phoebe', distance: 30.0, size: 0.055, speed: 0.35, angle: 0, parentPlanet: 'Saturn' },
                        { name: 'Miranda', distance: 1.8, size: 0.04, speed: 0.67, angle: 0, parentPlanet: 'Uranus' },
                        { name: 'Triton', distance: 3.0, size: 0.07, speed: 0.17, angle: 0, parentPlanet: 'Neptune' },
                        { name: 'Charon', distance: 1.8, size: 0.12, speed: 0.16, angle: 0, parentPlanet: 'Pluto' },
                        { name: 'Styx', distance: 4.0, size: 0.04, speed: 0.12, angle: 0, parentPlanet: 'Pluto' },
                        { name: 'Nix', distance: 5.5, size: 0.06, speed: 0.08, angle: 0, parentPlanet: 'Pluto' },
                        { name: 'Kerberos', distance: 7.0, size: 0.05, speed: 0.06, angle: 0, parentPlanet: 'Pluto' },
                        { name: 'Hydra', distance: 8.5, size: 0.08, speed: 0.04, angle: 0, parentPlanet: 'Pluto' }
                    ]}
                    controlsRef={controlsRef}
                />
                <LabelManager
                    showPlanetNames={showPlanetNames}
                    showMoonNames={showMoonNames}
                    isSunHovered={isSunHovered}
                />
                <ambientLight intensity={0.1} />
                <directionalLight position={[0, 0, 0]} intensity={1} />
                <Nebula />
                <TwinklingStars />
                <Sun
                    onClick={handleSunClick}
                    animationSpeed={animationSpeed}
                    onPointerOver={() => setIsSunHovered(true)}
                    onPointerOut={() => setIsSunHovered(false)}
                />
                {showOrbits && planets.map((planet) => (
                    <Orbit key={`orbit-${planet.name}`} radius={planet.distance} color="#ffffff" />
                ))}
                {planets.map((planet) => (
                    <Planet
                        key={planet.name}
                        planet={planet}
                        animationSpeed={animationSpeed}
                        onClick={() => handlePlanetClick(planet.name)}
                        onMoonClick={handleMoonClick}
                    />
                ))}
            </Canvas>

            <PlanetInfoModal
                isOpen={isPlanetInfoModalOpen}
                onClose={handleClosePlanetInfoModal}
                onMoonFollow={handleMoonClick}
                planetData={selectedPlanetData}
            />
        </div>
    )
}

export default SolarSystem;