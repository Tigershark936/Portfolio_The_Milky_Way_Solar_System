import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Planet as PlanetType } from '../../types/Planet';
import Moon from '../Moon/Moon.tsx';
// PlanetLabel supprimé

type Props = {
    planet: PlanetType;
    showName?: boolean;
    showMoonName?: boolean;
};

const Planet = ({ planet, showName = false, showMoonName = false }: Props) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const ringsRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const [planetTexture, setPlanetTexture] = useState<THREE.Texture | null>(null);
    const [ringsTexture, setRingsTexture] = useState<THREE.Texture | null>(null);

    // Charger la texture des planets
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        let texturePath = '';

        if (planet.name === 'Earth') {
            texturePath = '/textures/earth.jpg';
        } else if (planet.name === 'Jupiter') {
            texturePath = '/textures/jupiter.jpg';
        } else if (planet.name === 'Mars') {
            texturePath = '/textures/mars.jpg';
        } else if (planet.name === 'Saturn') {
            texturePath = '/textures/saturn.jpg';
        } else if (planet.name === 'Uranus') {
            texturePath = '/textures/uranus.jpg';
        } else if (planet.name === 'Neptune') {
            texturePath = '/textures/neptune.jpg';
        } else if (planet.name === 'Venus') {
            texturePath = '/textures/venus.jpg';
        } else if (planet.name === 'Mercury') {
            texturePath = '/textures/mercury.jpg';
        } else if (planet.name === 'Pluto') {
            texturePath = '/textures/pluton.jpg';
        }

        if (texturePath) {
            loader.load(
                texturePath,
                (texture) => {
                    setPlanetTexture(texture);
                }
            );
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
                '/textures/saturn-ring.jpg',
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

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * planet.speed * 0.1;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
        }
        // Rotation des anneaux de Saturne
        if (ringsRef.current && planet.name === 'Saturn') {
            ringsRef.current.rotation.z += delta * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh
                ref={meshRef}
                position={[planet.distance, 0, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[planet.size, 32, 32]} />
                <meshStandardMaterial
                    color={planet.color}
                    map={planetTexture || undefined}
                    emissive={hovered ? 0x222222 : 0x000000}
                />

                {/* Moon for Earth */}
                {planet.name === 'Earth' && (
                    <Moon
                        distance={3}
                        size={0.27 * 0.3}
                        color="#c0c0c0"
                        speed={0.3}
                        showName={showMoonName}
                    />
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