import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Nebula = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [nebulaTexture, setNebulaTexture] = useState<THREE.Texture | null>(null);

    // Charge la texture de la nébuleuse
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(
            '/textures/nebula.jpg',
            (texture) => {
                setNebulaTexture(texture);
            }
        );
    }, []);

    // M.A.J du matériau de la nébuleuse quand la texture change
    useEffect(() => {
        if (meshRef.current && nebulaTexture) {
            const material = meshRef.current.material as THREE.MeshBasicMaterial;
            material.map = nebulaTexture;
            material.needsUpdate = true;
        }
    }, [nebulaTexture]);

    // Rotation de la nébuleuse
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.002;
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[200, 64, 64]} />
            <meshBasicMaterial
                map={nebulaTexture || undefined}
                side={THREE.BackSide}
                toneMapped={false}
                color={new THREE.Color(1.2, 1.2, 1.2)}
                transparent={true}
                opacity={0.4}
            />
        </mesh>
    );
};

export default Nebula;
