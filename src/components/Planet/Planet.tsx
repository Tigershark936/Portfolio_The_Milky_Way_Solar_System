import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Planet as PlanetType} from '../../types/Planet';

type Props = {
    planet: PlanetType;
};

const Planet = ({ planet }: Props) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * planet.speed;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * planet.speed;
        }
    });

    return (
        <group ref={groupRef}>
            <mesh ref={meshRef} position={[planet.distance, 0, 0]}>
                <sphereGeometry args={[planet.size, 32, 32]} />
                <meshStandardMaterial color={planet.color} />
            </mesh>
        </group>
    )
}

export default Planet;