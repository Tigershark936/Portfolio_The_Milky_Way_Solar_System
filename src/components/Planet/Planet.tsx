import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { Planet as PlanetType } from '../../types/Planet';

type Props = {
    planet: PlanetType;
};

const Planet = ({ planet }: Props) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const textRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const { camera } = useThree();

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * planet.speed * 0.1;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
        }
        if (textRef.current && hovered) {
            textRef.current.lookAt(camera.position);
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
                <sphereGeometry args={[planet.size * 0.3, 32, 32]} />
                <meshStandardMaterial
                    color={planet.color}
                    emissive={hovered ? 0x222222 : 0x000000}
                />
            </mesh>

            {hovered && (
                <group ref={textRef} position={[planet.distance, planet.size * 0.5 + 1, 0]}>
                    <Text
                        position={[0, 0, 0]}
                        fontSize={0.5}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {planet.name}
                    </Text>
                </group>
            )}
        </group>
    );
};

export default Planet;