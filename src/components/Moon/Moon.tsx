import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PlanetLabel from '../UI/PlanetLabel';

type Props = {
    distance: number; // Distance from planet
    size: number; // Moon size
    color: string; // Moon color
    speed: number; // Orbital speed
    showName?: boolean; // Show moon name
    animationSpeed?: number; // Animation speed multiplier
};

const Moon = ({ distance, size, color, speed, showName = false, animationSpeed = 1 }: Props) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const [moonTexture, setMoonTexture] = useState<THREE.Texture | null>(null);

    // Charger la texture de la lune
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(
            '/textures/moon.jpg',
            (texture) => {
                setMoonTexture(texture);
            }
        );
    }, []);

    // M.A.J du matériau de la lune quand la texture change
    useEffect(() => {
        if (meshRef.current && moonTexture) {
            const material = meshRef.current.material as THREE.MeshStandardMaterial;
            material.map = moonTexture;
            material.needsUpdate = true;
        }
    }, [moonTexture]);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * speed * animationSpeed;
        }

        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5 * animationSpeed;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Moon */}
            <mesh
                ref={meshRef}
                position={[distance, 0, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[size, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    map={moonTexture || undefined}
                    emissive={hovered ? 0x222222 : 0x444444}
                    metalness={0.2}
                    roughness={0.9}
                />
            </mesh>

            {/* Label de la lune supprimé */}
        </group>
    );
};

export default Moon;
