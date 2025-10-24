import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import styles from './SolarSystem.module.scss';
import Sun from '../Sun/Sun';
import Planet from '../Planet/Planet';
import type { Planet as PlanetType } from '../../types/Planet';

// 🌌 Planètes avec couleurs NASA officielles mais distances visuelles
const planets: PlanetType[] = [
    { name: 'Mercury', distance: 6, size: 0.38, color: '#8c7853', speed: 4.15, angle: 0 },
    { name: 'Venus', distance: 9, size: 0.95, color: '#ffc649', speed: 1.62, angle: 0 },
    { name: 'Earth', distance: 12, size: 1.0, color: '#6b93d6', speed: 1, angle: 0 },
    { name: 'Mars', distance: 17, size: 0.53, color: '#cd5c5c', speed: 0.53, angle: 0 },
    { name: 'Jupiter', distance: 22, size: 11.21, color: '#d8ca9d', speed: 0.084, angle: 0 },
    { name: 'Saturn', distance: 27, size: 9.45, color: '#fad5a5', speed: 0.034, angle: 0 },
    { name: 'Uranus', distance: 32, size: 4.01, color: '#4fd0e7', speed: 0.012, angle: 0 },
    { name: 'Neptune', distance: 37, size: 3.88, color: '#4b70dd', speed: 0.006, angle: 0 },
    { name: 'Pluto', distance: 42, size: 0.18, color: '#8c7853', speed: 0.01, angle: 0 },
];

const SolarSystem = () => {
    return (
        <div className={styles.solarSystem}>
            <Canvas camera={{ position: [0, 20, 45], fov: 60 }}>
                <ambientLight intensity={0.1} />
                <directionalLight position={[0, 0, 0]} intensity={1} />
                <Stars radius={200} depth={60} count={5000} factor={6} saturation={0} fade />
                <Sun />
                {planets.map((planet) => (
                    <Planet key={planet.name} planet={planet} />
                ))}
            </Canvas>
        </div>
    )
}

export default SolarSystem;