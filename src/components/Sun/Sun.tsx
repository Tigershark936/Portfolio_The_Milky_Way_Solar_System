import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTexture } from '../../utils/texturePreloader';

type SunProps = {
    onClick?: () => void;
    animationSpeed?: number;
    onPointerOver?: () => void;
    onPointerOut?: () => void;
};

const Sun = ({ onClick, animationSpeed = 1, onPointerOver, onPointerOut }: SunProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [sunTexture, setSunTexture] = useState<THREE.Texture | null>(null);
    const [hovered, setHovered] = useState(false);

    // Gérer le curseur personnalisé au survol
    useEffect(() => {
        const canvas = document.querySelector('canvas');
        if (hovered && canvas) {
            canvas.style.cursor = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><defs><filter id=\'glow\'><feGaussianBlur stdDeviation=\'3\' result=\'coloredBlur\'/><feMerge><feMergeNode in=\'coloredBlur\'/><feMergeNode in=\'SourceGraphic\'/></feMerge></filter></defs><circle cx=\'16\' cy=\'16\' r=\'10\' fill=\'none\' stroke=\'%23FF6B35\' stroke-width=\'2\' filter=\'url(%23glow)\'/><circle cx=\'16\' cy=\'16\' r=\'4\' fill=\'%23FF6B35\' filter=\'url(%23glow)\'/><circle cx=\'16\' cy=\'16\' r=\'1\' fill=\'%23FFFFFF\'/></svg>"), auto';
        } else if (!hovered && canvas) {
            canvas.style.cursor = 'default';
        }
    }, [hovered]);

    // Charger la texture (depuis le cache ou en la chargeant)
    useEffect(() => {
        const texturePath = '/textures/sun.jpg';
        const cachedTexture = getTexture(texturePath);
        
        if (cachedTexture) {
            setSunTexture(cachedTexture);
        } else {
            // Si pas dans le cache, charger normalement
            const loader = new THREE.TextureLoader();
            loader.load(
                texturePath,
                (texture) => {
                    setSunTexture(texture);
                },
                undefined,
                (error) => {
                    console.error('❌ Erreur de chargement de la texture:', error);
                }
            );
        }
    }, []);

    // Mettre à jour le matériau quand la texture change
    useEffect(() => {
        if (meshRef.current && sunTexture) {
            const material = meshRef.current.material as THREE.MeshBasicMaterial;
            material.map = sunTexture;
            material.needsUpdate = true;
        }
    }, [sunTexture]);

    useFrame((_, delta) => {
        if (meshRef.current) {
            // Rotation du Soleil avec période réelle : ~25.4 jours à l'équateur
            // Vitesse angulaire = 2π / (période_en_secondes) radians/seconde
            const SUN_ROTATION_PERIOD_DAYS = 25.4; // jours à l'équateur
            const SUN_ROTATION_PERIOD_SECONDS = SUN_ROTATION_PERIOD_DAYS * 24 * 60 * 60; // secondes
            const SUN_ANGULAR_VELOCITY = (2 * Math.PI) / SUN_ROTATION_PERIOD_SECONDS; // rad/s réelle
            
            // En mode normal (animationSpeed = 1) : vitesse RÉELLE (25.4 jours pour une rotation)
            // Les boutons de vitesse permettent d'accélérer proportionnellement
            meshRef.current.rotation.y += delta * SUN_ANGULAR_VELOCITY * animationSpeed;
            // Rotation légère sur l'axe X pour un effet plus naturel (proportionnelle)
            meshRef.current.rotation.x += delta * SUN_ANGULAR_VELOCITY * 0.1 * animationSpeed;
        }
    });

    return (
        <group>
            {/* Lumière principale du soleil - NASA style */}
            <pointLight position={[0, 0, 0]} intensity={15.0} color={0xffffff} distance={2000} decay={0.5} />


            {/* Soleil principal avec texture */}
            <mesh
                ref={meshRef}
                position={[0, 0, 0]}
                name="sun"
                onClick={onClick}
                onPointerOver={() => {
                    setHovered(true);
                    onPointerOver?.();
                }}
                onPointerOut={() => {
                    setHovered(false);
                    onPointerOut?.();
                }}
            >
                <sphereGeometry args={[15, 64, 64]} />
                <meshBasicMaterial
                    color={new THREE.Color(1.2, 1.1, 0.9)}
                    map={sunTexture || undefined}
                />
            </mesh>
        </group>
    );
};

export default Sun;