import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Planet as PlanetType } from '../../types/SolarSystemDetails';
import Moon from '../Moon/Moon.tsx';
import { getTexture } from '../../utils/texturePreloader';

type Props = {
    planet: PlanetType;
    animationSpeed?: number;
    onClick?: () => void;
    onMoonClick?: (moonName: string) => void; // Added moon click handler
    onPointerOver?: () => void; // Callback pour notifier le survol
    onPointerOut?: () => void; // Callback pour notifier la fin du survol
};

const Planet = ({ planet, animationSpeed = 1, onClick, onMoonClick, onPointerOver, onPointerOut }: Props) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const ringsRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    // Initialiser baseAngleRef avec la valeur actuelle de planet.angle
    // Ce ref sera mis à jour dans useLayoutEffect quand planet.angle change
    const baseAngleRef = useRef<number>(planet.angle); // Référence pour l'angle de base
    const cumulativeRotationRef = useRef<number>(0); // Rotation cumulative depuis le dernier reset
    const [planetTexture, setPlanetTexture] = useState<THREE.Texture | null>(null);
    const [ringsTexture, setRingsTexture] = useState<THREE.Texture | null>(null);

    // Gérer le curseur personnalisé au survol
    useEffect(() => {
        const canvas = document.querySelector('canvas');
        if (hovered && canvas) {
            canvas.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><defs><filter id=\'glow\'><feGaussianBlur stdDeviation=\'3\' result=\'coloredBlur\'/><feMerge><feMergeNode in=\'coloredBlur\'/><feMergeNode in=\'SourceGraphic\'/></feMerge></filter></defs><circle cx=\'16\' cy=\'16\' r=\'10\' fill=\'none\' stroke=\'%234169E1\' stroke-width=\'2\' filter=\'url(%23glow)\'/><circle cx=\'16\' cy=\'16\' r=\'4\' fill=\'%234169E1\' filter=\'url(%23glow)\'/><circle cx=\'16\' cy=\'16\' r=\'1\' fill=\'%23FFFFFF\'/></svg>"), auto';
        } else if (!hovered && canvas) {
            canvas.style.cursor = 'default';
        }
    }, [hovered]);

    // Charger la texture des planets (depuis le cache ou en la chargeant)
    useEffect(() => {
        let texturePath = '';

        if (planet.name === 'Earth') {
            texturePath = '/textures/planets/earth.jpg';
        } else if (planet.name === 'Jupiter') {
            texturePath = '/textures/planets/jupiter.jpg';
        } else if (planet.name === 'Mars') {
            texturePath = '/textures/planets/mars.jpg';
        } else if (planet.name === 'Saturn') {
            texturePath = '/textures/planets/saturn.jpg';
        } else if (planet.name === 'Uranus') {
            texturePath = '/textures/planets/uranus.jpg';
        } else if (planet.name === 'Neptune') {
            texturePath = '/textures/planets/neptune.jpg';
        } else if (planet.name === 'Venus') {
            texturePath = '/textures/planets/venus.jpg';
        } else if (planet.name === 'Mercury') {
            texturePath = '/textures/planets/mercury.jpg';
        } else if (planet.name === 'Pluto') {
            texturePath = '/textures/planets/pluton.jpg';
        }

        if (texturePath) {
            const cachedTexture = getTexture(texturePath);

            if (cachedTexture) {
                setPlanetTexture(cachedTexture);
            } else {
                // Si pas dans le cache, charger normalement
                const loader = new THREE.TextureLoader();
                loader.load(
                    texturePath,
                    (texture) => {
                        setPlanetTexture(texture);
                    }
                );
            }
        }
    }, [planet.name]);

    // Mettre à jour le matériau quand la texture change
    useEffect(() => {
        if (meshRef.current && planetTexture && (planet.name === 'Earth' || planet.name === 'Jupiter' || planet.name === 'Mars' || planet.name === 'Saturn' || planet.name === 'Uranus' || planet.name === 'Neptune' || planet.name === 'Venus' || planet.name === 'Mercury' || planet.name === 'Pluto')) {
            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            material.map = planetTexture;
            material.needsUpdate = true;
        }
    }, [planetTexture, planet.name]);

    useEffect(() => {
        if (planet.name === 'Saturn') {
            const loader = new THREE.TextureLoader();
            loader.load(
                '/textures/planets/saturn-ring.jpg',
                (texture) => {
                    setRingsTexture(texture);
                }
            );
        }
    }, [planet.name]);

    useEffect(() => {
        if (ringsRef.current && ringsTexture && planet.name === 'Saturn') {
            const material = ringsRef.current.material as THREE.MeshBasicMaterial;
            material.map = ringsTexture;
            material.needsUpdate = true;
        }
    }, [ringsTexture, planet.name]);

    // Initialiser les rotations avec l'angle réel de la planète (position actuelle dans le système solaire)
    // Utiliser useLayoutEffect pour une mise à jour synchrone et fluide avant le rendu
    useLayoutEffect(() => {
        if (groupRef.current && meshRef.current) {
            const initialAngle = planet.angle; // Angle réel de la planète

            // Appliquer l'inclinaison orbitale (en degrés → radians) autour de l'axe X
            const inclinationDeg = planet.inclinationDeg || 0;
            groupRef.current.rotation.x = (inclinationDeg * Math.PI) / 180;

            // Vérifier si l'angle a changé de manière significative
            const angleChanged = Math.abs(baseAngleRef.current - initialAngle) > 1e-6;

            if (angleChanged) {
                // Mettre à jour l'angle de base et réinitialiser la rotation cumulative
                baseAngleRef.current = initialAngle;
                cumulativeRotationRef.current = 0;
            }

            // Application directe et fluide de la position (sans requestAnimationFrame dans useLayoutEffect)
            groupRef.current.rotation.y = baseAngleRef.current + cumulativeRotationRef.current;

            // Rotation sur elle-même indépendante de la position orbitale
            meshRef.current.rotation.y = initialAngle * 0.5;

            if (ringsRef.current && planet.name === 'Saturn') {
                ringsRef.current.rotation.z = initialAngle * 0.2;
            }
        }
    }, [planet.angle, planet.name]);

    useFrame((_, delta) => {
        // Animation avec vitesses orbitales RÉELLES proportionnelles
        // delta est en secondes réelles entre les frames

        // Calcul de la vitesse angulaire réelle pour chaque planète
        // Vitesse angulaire = 2π / (période_en_secondes) radians/seconde
        // Pour que la Terre fasse un tour complet en 365.25 jours RÉELS :
        const EARTH_ORBITAL_PERIOD_SECONDS = 365.25 * 24 * 60 * 60; // 31557600 secondes
        const EARTH_ANGULAR_VELOCITY = (2 * Math.PI) / EARTH_ORBITAL_PERIOD_SECONDS; // ≈ 1.99e-7 rad/s

        // La vitesse relative (planet.speed) ajuste la vitesse selon la période de chaque planète
        // Ex: Mercure avec speed=4.15 tourne 4.15x plus vite que la Terre
        const realAngularVelocity = EARTH_ANGULAR_VELOCITY * planet.speed;

        // En mode normal (animationSpeed = 1) : vitesse RÉELLE (365 jours pour la Terre)
        // Les boutons de vitesse permettent d'accélérer (2x, 5x, 10x, etc.)
        // Calculer la rotation à partir de l'angle de base + rotation cumulative
        if (groupRef.current) {
            // Accumuler la rotation depuis le dernier reset
            cumulativeRotationRef.current += delta * realAngularVelocity * animationSpeed;
            // Appliquer l'angle de base + la rotation cumulative
            groupRef.current.rotation.y = baseAngleRef.current + cumulativeRotationRef.current;
        }

        // Rotation sur elle-même avec période RÉELLE (rotation axiale)
        // Périodes de rotation des planètes (en heures ou jours)
        const PLANET_ROTATION_PERIODS: Record<string, number> = {
            'Mercury': 58.6 * 24,    // 58.6 jours en heures
            'Venus': 243 * 24,       // 243 jours en heures (rotation rétrograde)
            'Earth': 23.93,          // 23.93 heures
            'Mars': 24.6,            // 24.6 heures
            'Jupiter': 9.9,           // 9.9 heures
            'Saturn': 10.7,           // 10.7 heures
            'Uranus': 17.2,           // 17.2 heures
            'Neptune': 16.1,          // 16.1 heures
            'Pluto': 6.39 * 24,       // 6.39 jours en heures
        };

        if (meshRef.current) {
            const rotationPeriodHours = PLANET_ROTATION_PERIODS[planet.name] || 24; // Par défaut 24h si non trouvé
            const rotationPeriodSeconds = rotationPeriodHours * 60 * 60; // Convertir en secondes
            const angularVelocity = (2 * Math.PI) / rotationPeriodSeconds; // rad/s réelle

            // Pour Vénus, la rotation est rétrograde (sens inverse)
            const rotationDirection = planet.name === 'Venus' ? -1 : 1;

            // En mode normal (animationSpeed = 1) : vitesse RÉELLE
            meshRef.current.rotation.y += delta * angularVelocity * rotationDirection * animationSpeed;
        }

        // Rotation des anneaux de Saturne
        if (ringsRef.current && planet.name === 'Saturn') {
            ringsRef.current.rotation.z += delta * 0.1 * animationSpeed;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh
                ref={meshRef}
                position={[planet.distance, 0, 0]}
                onPointerOver={() => {
                    setHovered(true);
                    onPointerOver?.(); // Notifier le parent du survol
                }}
                onPointerOut={() => {
                    setHovered(false);
                    onPointerOut?.(); // Notifier le parent de la fin du survol
                }}
                onClick={onClick}
                name={`planet-${planet.name}`}
            >
                <sphereGeometry args={[planet.size, 32, 32]} />
                <meshStandardMaterial
                    color={planet.color}
                    map={planetTexture || undefined}
                    emissive={hovered ? 0x222222 : 0x000000}
                />

                {/* Moons */}
                {planet.name === 'Earth' && (
                    <Moon
                        distance={3}
                        size={0.27 * 0.3}
                        color="#c0c0c0"
                        speed={0.3}
                        animationSpeed={animationSpeed}
                        name="Lune"
                        onClick={() => onMoonClick?.('Lune')}
                    />
                )}
                {/* Mars Moons */}
                {planet.name === 'Mars' && (
                    <>
                        <Moon
                            distance={2}
                            size={0.05}
                            color="#8B7355"
                            speed={0.32}
                            animationSpeed={animationSpeed}
                            name="Phobos"
                            onClick={() => onMoonClick?.('Phobos')}
                        />
                        <Moon
                            distance={2.8}
                            size={0.04}
                            color="#8B7355"
                            speed={0.08}
                            animationSpeed={animationSpeed}
                            name="Deimos"
                            onClick={() => onMoonClick?.('Deimos')}
                        />
                    </>
                )}
                {/* Jupiter Moons */}
                {planet.name === 'Jupiter' && (
                    <>
                        <Moon
                            distance={12}
                            size={0.12}
                            color="#FFFF00"
                            speed={0.56}
                            animationSpeed={animationSpeed}
                            name="Io"
                            onClick={() => onMoonClick?.('Io')}
                        />
                        <Moon
                            distance={15}
                            size={0.11}
                            color="#87CEEB"
                            speed={0.28}
                            animationSpeed={animationSpeed}
                            name="Europa"
                            onClick={() => onMoonClick?.('Europa')}
                        />
                        <Moon
                            distance={18}
                            size={0.16}
                            color="#D3D3D3"
                            speed={0.14}
                            animationSpeed={animationSpeed}
                            name="Ganymede"
                            onClick={() => onMoonClick?.('Ganymede')}
                        />
                        <Moon
                            distance={22}
                            size={0.15}
                            color="#8B8B8B"
                            speed={0.06}
                            animationSpeed={animationSpeed}
                            name="Callisto"
                            onClick={() => onMoonClick?.('Callisto')}
                        />
                    </>
                )}
                {/* Saturn Moons */}
                {planet.name === 'Saturn' && (
                    <>
                        <Moon
                            distance={7.5}
                            size={0.18}
                            color="#8B8B8B"
                            speed={0.94}
                            animationSpeed={animationSpeed}
                            name="Mimas"
                            onClick={() => onMoonClick?.('Mimas')}
                        />
                        <Moon
                            distance={9}
                            size={0.18}
                            color="#FFFFFF"
                            speed={0.73}
                            animationSpeed={animationSpeed}
                            name="Enceladus"
                            onClick={() => onMoonClick?.('Enceladus')}
                        />
                        <Moon
                            distance={11}
                            size={0.20}
                            color="#A0A0A0"
                            speed={0.41}
                            animationSpeed={animationSpeed}
                            name="Tethys"
                            onClick={() => onMoonClick?.('Tethys')}
                        />
                        <Moon
                            distance={13}
                            size={0.22}
                            color="#D3D3D3"
                            speed={0.26}
                            animationSpeed={animationSpeed}
                            name="Dione"
                            onClick={() => onMoonClick?.('Dione')}
                        />
                        <Moon
                            distance={15}
                            size={0.24}
                            color="#E0E0E0"
                            speed={0.16}
                            animationSpeed={animationSpeed}
                            name="Rhea"
                            onClick={() => onMoonClick?.('Rhea')}
                        />
                        <Moon
                            distance={17}
                            size={0.35}
                            color="#FF8C00"
                            speed={0.063}
                            animationSpeed={animationSpeed}
                            name="Titan"
                            onClick={() => onMoonClick?.('Titan')}
                        />
                        <Moon
                            distance={20}
                            size={0.14}
                            color="#9C7A4F"
                            speed={0.95}
                            animationSpeed={animationSpeed}
                            name="Hyperion"
                            onClick={() => onMoonClick?.('Hyperion')}
                        />
                        <Moon
                            distance={22}
                            size={0.20}
                            color="#4A4A4A"
                            speed={0.08}
                            animationSpeed={animationSpeed}
                            name="Lapetus"
                            onClick={() => onMoonClick?.('Lapetus')}
                        />
                        <Moon
                            distance={26}
                            size={0.15}
                            color="#2C2C2C"
                            speed={0.35}
                            animationSpeed={animationSpeed}
                            name="Phoebe"
                            onClick={() => onMoonClick?.('Phoebe')}
                        />
                    </>
                )}
                {/* Uranus Moon */}
                {planet.name === 'Uranus' && (
                    <Moon
                        distance={6.0}
                        size={0.06}
                        color="#B0E0E6"
                        speed={0.67}
                        animationSpeed={animationSpeed}
                        name="Miranda"
                        onClick={() => onMoonClick?.('Miranda')}
                    />
                )}
                {/* Neptune Moon */}
                {planet.name === 'Neptune' && (
                    <Moon
                        distance={3.5}
                        size={0.10}
                        color="#ADD8E6"
                        speed={0.17}
                        animationSpeed={animationSpeed}
                        name="Triton"
                        onClick={() => onMoonClick?.('Triton')}
                    />
                )}
                {/* Pluto Moons */}
                {planet.name === 'Pluto' && (
                    <>
                        <Moon
                            distance={1.5}
                            size={0.15}
                            color="#B0C4DE"
                            speed={0.16}
                            animationSpeed={animationSpeed}
                            name="Charon"
                            onClick={() => onMoonClick?.('Charon')}
                        />
                        <Moon
                            distance={3.0}
                            size={0.06}
                            color="#8B7355"
                            speed={0.12}
                            animationSpeed={animationSpeed}
                            name="Styx"
                            onClick={() => onMoonClick?.('Styx')}
                        />
                        <Moon
                            distance={4.2}
                            size={0.08}
                            color="#9370DB"
                            speed={0.08}
                            animationSpeed={animationSpeed}
                            name="Nix"
                            onClick={() => onMoonClick?.('Nix')}
                        />
                        <Moon
                            distance={5.5}
                            size={0.07}
                            color="#2F2F2F"
                            speed={0.06}
                            animationSpeed={animationSpeed}
                            name="Kerberos"
                            onClick={() => onMoonClick?.('Kerberos')}
                        />
                        <Moon
                            distance={7.0}
                            size={0.10}
                            color="#8B6914"
                            speed={0.04}
                            animationSpeed={animationSpeed}
                            name="Hydra"
                            onClick={() => onMoonClick?.('Hydra')}
                        />
                    </>
                )}
            </mesh>

            {/* Anneaux de Saturne */}
            {planet.name === 'Saturn' && (
                <mesh ref={ringsRef} position={[planet.distance, 0, 0]} rotation={[0.8, 0, 0]} castShadow receiveShadow>
                    <ringGeometry args={[planet.size * 1.2, planet.size * 1.5, 64]} />
                    <meshBasicMaterial
                        map={ringsTexture || undefined}
                        side={THREE.DoubleSide}
                        transparent={true}
                        opacity={0.5}
                        alphaMap={ringsTexture || undefined}
                    />
                </mesh>
            )}
        </group>
    );
};

export default Planet;