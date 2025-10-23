import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import styles from './SolarSystem.module.scss';
import Sun from '../Sun/Sun';
import Planet from '../Planet/Planet';
import type { Planet as PlanetType } from '../../types/Planet';

const planets: PlanetType[] = [
    { name: 'Mercury', distance: 4, size: 0.38, color: '#b1b1b1', speed: 4.15, angle: 0 },
    { name: 'Venus', distance: 7, size: 0.95, color: '#e0c16f', speed: 1.62, angle: 0 },
    { name: 'Earth', distance: 10, size: 1.0, color: '#6fa8dc', speed: 1, angle: 0 },
    { name: 'Mars', distance: 15, size: 0.53, color: '#c1440e', speed: 0.53, angle: 0 },
    { name: 'Jupiter', distance: 20, size: 11.21, color: '#d2b48c', speed: 0.084, angle: 0 },
    { name: 'Saturn', distance: 25, size: 9.45, color: '#f4e1a1', speed: 0.034, angle: 0 },
    { name: 'Uranus', distance: 30, size: 4.01, color: '#aee1e1', speed: 0.012, angle: 0 },
    { name: 'Neptune', distance: 35, size: 3.88, color: '#4169e1', speed: 0.006, angle: 0 },
    { name: 'Pluto', distance: 40, size: 0.18, color: '#8c7853', speed: 0.01, angle: 0 },
];

const SolarSystem = () => {
    return (
        <div className={styles.solarSystem}>
            <Canvas camera={{ position: [0, 20, 30], fov: 60 }}>
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