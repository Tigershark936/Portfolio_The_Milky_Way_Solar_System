import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

type PlanetLabelProps = {
    name: string;
    position: [number, number, number];
    size: number;
    isActive: boolean;
    type?: 'planet' | 'moon' | 'asteroid' | 'comet' | 'star';
};

const PlanetLabel = ({ name, position, size, isActive, type = 'planet' }: PlanetLabelProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    // Fonction pour obtenir les couleurs selon le type d'objet céleste - Style exact du site de référence
    const getColorsByType = (objectType: string) => {
        switch (objectType) {
            case 'planet':
                return {
                    border: 'rgba(255, 214, 10, 0.5)', // Style exact du site de référence
                    background: 'rgba(11, 61, 145, 0.9)', // Style exact du site de référence
                    text: '#ffffff'
                };
            case 'moon':
                return {
                    border: 'rgba(255, 214, 10, 0.4)', // Style exact du site de référence
                    background: 'rgba(252, 61, 33, 0.9)', // Style exact du site de référence
                    text: '#ffffff'
                };
            case 'star':
                return {
                    border: 'rgba(255, 214, 10, 0.5)', // Style exact du site de référence
                    background: 'rgba(11, 61, 145, 0.9)', // Style exact du site de référence
                    text: '#ffffff'
                };
            default:
                return {
                    border: 'rgba(255, 214, 10, 0.5)',
                    background: 'rgba(11, 61, 145, 0.9)',
                    text: '#ffffff'
                };
        }
    };

    useFrame(() => {
        if (groupRef.current) {
            // Faire en sorte que l'étiquette regarde toujours la caméra
            groupRef.current.lookAt(camera.position);
        }
    });

    if (!isActive) return null;

    const colors = getColorsByType(type);
    // Tailles TRIPLÉES pour être visibles comme les labels de test
    let fontSize, offsetY, paddingX, paddingY;
    if (type === 'moon') {
        fontSize = 1.8; // TRIPLÉ (0.6 x 3)
        offsetY = size + 0.2;
        paddingX = 0.9; // TRIPLÉ (0.3 x 3)
        paddingY = 0.18; // TRIPLÉ (0.06 x 3)
    } else if (type === 'star') {
        fontSize = 2.1; // TRIPLÉ (0.7 x 3)
        offsetY = size * 0.5 + 1.2;
        paddingX = 1.2; // TRIPLÉ (0.4 x 3)
        paddingY = 0.3; // TRIPLÉ (0.1 x 3)
    } else {
        fontSize = 2.1; // TRIPLÉ (0.7 x 3)
        offsetY = size * 0.5 + 0.8;
        paddingX = 1.2; // TRIPLÉ (0.4 x 3)
        paddingY = 0.3; // TRIPLÉ (0.1 x 3)
    }

    return (
        <group ref={groupRef} position={[position[0], position[1] + offsetY, position[2]]}>
            {/* Fond avec bordure intégrée - Style exact des labels de test */}
            <mesh>
                <planeGeometry args={[
                    name.length * fontSize + paddingX * 2,
                    fontSize + paddingY * 2
                ]} />
                <meshBasicMaterial
                    color={0x0b3d91} // rgba(11, 61, 145, 0.9)
                    transparent={true}
                    opacity={0.9}
                />
            </mesh>

            {/* Bordure fine - Style exact des labels de test */}
            <mesh>
                <planeGeometry args={[
                    name.length * fontSize + paddingX * 2 + 0.01,
                    fontSize + paddingY * 2 + 0.01
                ]} />
                <meshBasicMaterial
                    color={0xffd60a} // rgba(255, 214, 10, 0.5)
                    transparent={true}
                    opacity={0.5}
                />
            </mesh>

            {/* Texte blanc - Style exact des labels de test */}
            <Text
                position={[0, 0, 0.01]}
                fontSize={fontSize}
                color={0xffffff}
                anchorX="center"
                anchorY="middle"
                maxWidth={200}
                lineHeight={1}
                letterSpacing={0.015}
                textAlign="center"
            >
                {name.toUpperCase()}
            </Text>
        </group>
    );
};

export default PlanetLabel;
