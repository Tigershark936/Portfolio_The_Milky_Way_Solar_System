import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getTexture } from '../../utils/texturePreloader';

type Props = {
    distance: number; // Distance from planet
    size: number; // Moon size
    color: string; // Moon color
    speed: number; // Orbital speed
    animationSpeed?: number; // Animation speed multiplier
    name?: string; // Moon name for identification
    onClick?: () => void; // Click handler
};

const Moon = ({ distance, size, color, speed, animationSpeed = 1, name = 'Moon', onClick }: Props) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const [moonTexture, setMoonTexture] = useState<THREE.Texture | null>(null);

    // Charger la texture de la lune
    useEffect(() => {
        const loader = new THREE.TextureLoader();
        let texturePath = '';

        // Définir le chemin de texture selon le nom de la lune
        switch (name) {
            case 'Lune':
                texturePath = '/textures/moons/moon.jpg';
                break;
            case 'Phobos':
                texturePath = '/textures/moons/phobos.jpg';
                break;
            case 'Deimos':
                texturePath = '/textures/moons/deimos.jpg';
                break;
            case 'Io':
                texturePath = '/textures/moons/io.jpg';
                break;
            case 'Europa':
                texturePath = '/textures/moons/europa.jpg';
                break;
            case 'Ganymede':
                texturePath = '/textures/moons/ganymede.jpg';
                break;
            case 'Callisto':
                texturePath = '/textures/moons/callisto.jpg';
                break;
            case 'Titan':
                texturePath = '/textures/moons/titan.jpg';
                break;
            case 'Enceladus':
                texturePath = '/textures/moons/enceladus.jpg';
                break;
            case 'Mimas':
                texturePath = '/textures/moons/mimas.jpg';
                break;
            case 'Tethys':
                texturePath = '/textures/moons/tethys.jpg';
                break;
            case 'Dione':
                texturePath = '/textures/moons/dione.jpg';
                break;
            case 'Rhea':
                texturePath = '/textures/moons/rhea.jpg';
                break;
            case 'Hyperion':
                texturePath = '/textures/moons/hyperion.jpg';
                break;
            case 'Lapetus':
                texturePath = '/textures/moons/lapetus.jpg';
                break;
            case 'Phoebe':
                texturePath = '/textures/moons/phoebe.jpg';
                break;
            case 'Miranda':
                texturePath = '/textures/moons/miranda.png';
                break;
            case 'Triton':
                texturePath = '/textures/moons/triton.jpg';
                break;
            case 'Charon':
                texturePath = '/textures/moons/charon.jpg';
                break;
            case 'Styx':
                texturePath = '/textures/moons/styx.jpg';
                break;
            case 'Nix':
                texturePath = '/textures/moons/nix.jpg';
                break;
            case 'Kerberos':
                texturePath = '/textures/moons/kerberos.jpg';
                break;
            case 'Hydra':
                texturePath = '/textures/moons/hydra.jpg';
                break;
            default:
                texturePath = '/textures/moons/moon.jpg';
        }

        if (texturePath) {
            // Vérifier d'abord le cache
            const cachedTexture = getTexture(texturePath);

            if (cachedTexture) {
                setMoonTexture(cachedTexture);
            } else {
                // Si pas dans le cache, charger normalement
                loader.load(
                    texturePath,
                    (texture) => {
                        setMoonTexture(texture);
                    },
                    undefined,
                    () => {
                        console.warn(`Texture non trouvée pour ${name}: ${texturePath}, utilisation de la texture par défaut`);
                        // Charger la texture par défaut en cas d'erreur (depuis le cache si possible)
                        const defaultCached = getTexture('/textures/moons/moon.jpg');
                        if (defaultCached) {
                            setMoonTexture(defaultCached);
                        } else {
                            loader.load('/textures/moons/moon.jpg', (defaultTexture) => {
                                setMoonTexture(defaultTexture);
                            });
                        }
                    }
                );
            }
        }
    }, [name]);

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
                name={`moon-${name}`}
                onPointerOver={e => { setHovered(true); e.stopPropagation(); }}
                onPointerOut={e => { setHovered(false); e.stopPropagation(); }}
                onClick={e => { e.stopPropagation(); onClick?.(); }}
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
        </group>
    );
};

export default Moon;
