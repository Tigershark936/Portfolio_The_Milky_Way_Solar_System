import { Canvas } from '@react-three/fiber';
import styles from './SolarSystem.module.scss';
import Sun from '../Sun/Sun';
import Planet from '../Planet/Planet';
import Nebula from '../Nebula/Nebula';
import TwinklingStars from '../TwinklingStars/Stars';
import type { Planet as PlanetType } from '../../types/Planet';

// Planètes avec couleurs NASA officielles, distances bien espacées et tailles ajustées
const planets: PlanetType[] = [
    { name: 'Mercury', distance: 16, size: 0.23, color: '#8c7853', speed: 4.15, angle: 0 }, // 0.38 * 0.6
    { name: 'Venus', distance: 22, size: 0.57, color: '#ffc649', speed: 1.62, angle: 0 }, // 0.95 * 0.6
    { name: 'Earth', distance: 31, size: 0.3, color: '#6b93d6', speed: 1, angle: 0 }, // 1.0 * 0.3
    { name: 'Mars', distance: 40, size: 0.32, color: '#cd5c5c', speed: 0.53, angle: 0 }, // 0.53 * 0.6
    { name: 'Jupiter', distance: 60, size: 8.97, color: '#d8ca9d', speed: 0.084, angle: 0 }, // 11.21 * 0.8
    { name: 'Saturn', distance: 85, size: 6.62, color: '#fad5a5', speed: 0.034, angle: 0 }, // 9.45 * 0.7
    { name: 'Uranus', distance: 110, size: 2.01, color: '#4fd0e7', speed: 0.012, angle: 0 }, // 4.01 * 0.5
    { name: 'Neptune', distance: 135, size: 1.94, color: '#4b70dd', speed: 0.006, angle: 0 }, // 3.88 * 0.5
    { name: 'Pluto', distance: 160, size: 0.14, color: '#8c7853', speed: 0.01, angle: 0 }, // 0.18 * 0.8
];

const SolarSystem = () => {
    return (
        <div className={styles.solarSystem}>
            <Canvas camera={{ position: [0, 50, 130], fov: 60 }}>
                <ambientLight intensity={0.1} />
                <directionalLight position={[0, 0, 0]} intensity={1} />
                <Nebula />
                <TwinklingStars />
                <Sun />
                {planets.map((planet) => (
                    <Planet key={planet.name} planet={planet} />
                ))}
            </Canvas>
        </div>
    )
}

export default SolarSystem;