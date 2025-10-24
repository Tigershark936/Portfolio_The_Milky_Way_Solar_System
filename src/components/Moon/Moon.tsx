import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

type Props = {
    distance: number; // Distance from planet
    size: number; // Moon size
    color: string; // Moon color
    speed: number; // Orbital speed
    angle: number; // Current angle
};

const Moon = ({ distance, size, color, speed, angle }: Props) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const textRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);
    const { camera } = useThree();

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * speed;
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
                    emissive={hovered ? 0x222222 : 0x444444}
                    metalness={0.2}
                    roughness={0.9}
                />
            </mesh>

            {hovered && (
                <group ref={textRef} position={[distance, size + 0.5, 0]}>
                    <Text
                        position={[0, 0, 0]}
                        fontSize={0.3}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        MOON
                    </Text>
                </group>
            )}
        </group>
    );
};

export default Moon;
