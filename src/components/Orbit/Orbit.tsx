import { useMemo } from 'react';
import * as THREE from 'three';

type OrbitProps = {
    radius: number;
    color?: string;
};

const Orbit = ({ radius, color = '#ffffff' }: OrbitProps) => {
    const points = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        const segments = 256; // Plus de segments pour des cercles plus lisses

        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            pts.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            ));
        }

        return pts;
    }, [radius]);

    return (
        <line geometry={new THREE.BufferGeometry().setFromPoints(points)}>
            <lineBasicMaterial
                attach="material"
                color={color}
                transparent
                opacity={0.2}
                linewidth={2}
            />
        </line>
    );
};

export default Orbit;

