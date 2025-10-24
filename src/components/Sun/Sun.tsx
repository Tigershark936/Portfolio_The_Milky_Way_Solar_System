import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Sun = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [sunTexture, setSunTexture] = useState<THREE.Texture | null>(null);

    // Charger la texture de manière asynchrone
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        loader.load(
            '/textures/sun.jpg',
            (texture) => {
                console.log('✅ Texture chargée avec succès !');
                setSunTexture(texture);
            },
            undefined,
            (error) => {
                console.error('❌ Erreur de chargement de la texture:', error);
            }
        );
    }, []);

    // Mettre à jour le matériau quand la texture change
    useEffect(() => {
        if (meshRef.current && sunTexture) {
            const material = meshRef.current.material as THREE.MeshBasicMaterial;
            material.map = sunTexture;
            material.needsUpdate = true;
            console.log('🔄 Matériau mis à jour avec la texture !');
        }
    }, [sunTexture]);

    useFrame((_, delta) => {
        if (meshRef.current) {
            // Rotation réaliste : 25 jours pour une rotation complète
            // 360° / (25 jours * 24h * 60min * 60sec) = 0.000167°/sec
            meshRef.current.rotation.y += delta * 0.000167; // Rotation réaliste sur l'axe Y
            meshRef.current.rotation.x += delta * 0.0001; // Rotation réaliste sur l'axe X
        }
    });

    return (
        <group>
            {/* Lumière principale du soleil - NASA style */}
            <pointLight position={[0, 0, 0]} intensity={15.0} color={0xffffff} distance={2000} decay={0.5} />


            {/* Soleil principal avec texture */}
            <mesh ref={meshRef} position={[0, 0, 0]}>
                <sphereGeometry args={[15, 64, 64]} />
                <meshBasicMaterial
                    color={new THREE.Color(1.2, 1.1, 0.9)}
                    map={sunTexture || undefined}
                />
            </mesh>

            {/* Label du soleil supprimé */}
        </group>
    );
};

export default Sun;