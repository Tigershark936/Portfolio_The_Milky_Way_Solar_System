import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const TwinklingStars = () => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.0001;
        }

        // Animation de scintillement pour chaque étoile
        groupRef.current?.children.forEach((star, index) => {
            if (star instanceof THREE.Points) {
                const material = star.material as THREE.PointsMaterial;
                const time = Date.now() * 0.001;

                // Pourcentage variable qui change constamment (entre 10% et 80%)
                const variablePercentage = 0.1 + (Math.sin(time * 0.05) + 1) / 2 * 0.7;

                // Seuil dynamique qui change avec le pourcentage
                const threshold = 1 - variablePercentage;
                const shouldTwinkle = (Math.sin(time * 0.1 + index * 0.5) + 1) / 2 > threshold;

                if (shouldTwinkle) {
                    // Effet de scintillement avec des fréquences différentes pour chaque étoile
                    const twinkle = Math.sin(time * (2 + index * 0.1)) * 0.5 + 0.5;
                    const intensity = 0.3 + twinkle * 0.7; // Entre 0.3 et 1.0

                    material.opacity = intensity;
                    material.size = 0.1 + twinkle * 0.3; // Taille stars
                } else {
                    // Étoiles normales (pas de scintillement)
                    material.opacity = 0.6;
                    material.size = 0.15;
                }
            }
        });
    });

    // Création des étoiles avec des positions aléatoires
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // Positions sphériques aléatoires
        const radius = 150 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Couleurs d'étoiles réalistes (blanc, bleu, jaune, rouge)
        const starType = Math.random();
        if (starType < 0.1) {
            // Étoiles bleues (très chaudes)
            colors[i * 3] = 0.6;
            colors[i * 3 + 1] = 0.8;
            colors[i * 3 + 2] = 1.0;
        } else if (starType < 0.3) {
            // Étoiles blanches
            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 1.0;
            colors[i * 3 + 2] = 1.0;
        } else if (starType < 0.7) {
            // Étoiles jaunes (comme le Soleil)
            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 0.9;
            colors[i * 3 + 2] = 0.7;
        } else {
            // Étoiles rouges (plus froides)
            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = 0.6;  
            colors[i * 3 + 2] = 0.4; 
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return (
        <group ref={groupRef}>
            <points raycast={null}>
                <bufferGeometry attach="geometry" {...geometry} />
                <pointsMaterial
                    size={0.2}
                    sizeAttenuation={true}
                    vertexColors={true}
                    transparent={true}
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </group>
    );
};

export default TwinklingStars;
