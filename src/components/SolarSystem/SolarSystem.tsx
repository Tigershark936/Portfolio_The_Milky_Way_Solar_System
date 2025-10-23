import { Canvas } from '@react-three/fiber';
import styles from './SolarSystem.module.scss';
import Sun from '../Sun/Sun';
import Planet from '../Planet/Planet';
import type { Planet as PlanetType } from '../../types/Planet';

const planets: PlanetType[] = [
    { name: 'Mercury', distance: 6, size: 0.4, color: '#b1b1b1', speed: 4.15, angle: 0 },
    { name: 'Venus', distance: 9, size: 0.95, color: '#e0c16f', speed: 1.62, angle: 0 },
    { name: 'Earth', distance: 12, size: 1, color: '#6fa8dc', speed: 1, angle: 0 },
    { name: 'Mars', distance: 15, size: 0.53, color: '#c1440e', speed: 0.53, angle: 0 },
    { name: 'Jupiter', distance: 22, size: 11.2, color: '#d2b48c', speed: 0.084, angle: 0 },
    { name: 'Saturn', distance: 28, size: 9.45, color: '#f4e1a1', speed: 0.034, angle: 0 },
    { name: 'Uranus', distance: 34, size: 4, color: '#aee1e1', speed: 0.012, angle: 0 },
    { name: 'Neptune', distance: 39, size: 3.88, color: '#4169e1', speed: 0.006, angle: 0 },
    { name: 'Pluto', distance: 45, size: 0.18, color: '#8c7853', speed: 0.004, angle: 0 },
];

const SolarSystem = () => {
    return (
        <div className={styles.solarSystem}>
            <Canvas>
                <ambientLight intensity={0.1} />
                <Sun />
                {planets.map((planet) => (
                    <Planet key={planet.name} planet={planet} />
                ))}
            </Canvas>
        </div>
    )
}

export default SolarSystem;