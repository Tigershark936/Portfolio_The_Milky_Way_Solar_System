import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Planet as PlanetType } from '../../types/Planet';
import Moon from '../Moon/Moon.tsx';
import { getTexture } from '../../utils/texturePreloader';

type Props = {
    planet: PlanetType;
    animationSpeed?: number;
    onClick?: () => void;
    onMoonClick?: (moonName: string) => void; // Added moon click handler
};

const Planet = ({ planet, animationSpeed = 1, onClick, onMoonClick }: Props) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const ringsRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
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

    // Initialiser les rotations synchronisées avant le premier rendu pour éviter le délai
    useLayoutEffect(() => {
        if (groupRef.current && meshRef.current) {
            // Définir des angles initiaux aléatoires pour plus de variété visuelle
            const initialAngle = Math.random() * Math.PI * 2;
            groupRef.current.rotation.y = initialAngle;
            meshRef.current.rotation.y = initialAngle * 0.5;

            if (ringsRef.current && planet.name === 'Saturn') {
                ringsRef.current.rotation.z = initialAngle * 0.2;
            }
        }
    }, [planet.name]);

    useFrame((_, delta) => {
        // Animation immédiate sans conditions pour éviter tout délai
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * planet.speed * 0.1 * animationSpeed;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5 * animationSpeed;
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
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
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
                        distance={1.5}
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