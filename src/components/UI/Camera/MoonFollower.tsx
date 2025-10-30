import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type MoonFollowerProps = {
    selectedMoon: string | null;
    moons: Array<{ name: string; distance: number; speed: number; angle: number; size: number; parentPlanet: string }>;
    controlsRef: React.RefObject<any>;
};

const MoonFollower = ({ selectedMoon, moons, controlsRef }: MoonFollowerProps) => {
    const isFollowing = useRef(false);
    const lastMoonPosition = useRef(new THREE.Vector3());
    const { scene } = useThree();

    useEffect(() => {
        isFollowing.current = !!selectedMoon;

        // Positionner immédiatement la caméra sur la lune au moment de la sélection
        if (selectedMoon && controlsRef.current) {
            const moon = moons.find(m => m.name === selectedMoon);
            if (moon) {
                // Trouver le mesh de la lune dans la scène
                const moonMesh = scene.getObjectByName(`moon-${moon.name}`);
                if (!moonMesh) {
                    console.warn(`Moon mesh not found: moon-${moon.name}`);
                    return;
                }

                // Obtenir la position mondiale réelle de la lune
                const moonPosition = new THREE.Vector3();
                moonMesh.getWorldPosition(moonPosition);

                // Distance adaptée à la taille de la lune
                const distanceFromMoon = Math.max(moon.size * 8, 3);
                const height = distanceFromMoon * 0.3;

                // Calculer la direction de la lune par rapport à sa planète parent
                const direction = moonPosition.clone().normalize();
                const cameraOffset = direction.clone().multiplyScalar(-distanceFromMoon);
                cameraOffset.y = height;

                const cameraPosition = moonPosition.clone().add(cameraOffset);

                // Mettre à jour la caméra et la cible immédiatement
                controlsRef.current.object.position.copy(cameraPosition);
                controlsRef.current.target.copy(moonPosition);
                controlsRef.current.minDistance = distanceFromMoon * 0.25;
                controlsRef.current.maxDistance = distanceFromMoon * 3;
                controlsRef.current.update();

                // Sauvegarder la position pour le suivi continu
                lastMoonPosition.current.copy(moonPosition);
            }
        }
    }, [selectedMoon, moons, controlsRef, scene]);

    useFrame(() => {
        if (!isFollowing.current || !selectedMoon || !controlsRef.current) return;

        const moon = moons.find(m => m.name === selectedMoon);
        if (!moon) return;

        // Trouver le mesh de la lune dans la scène
        const moonMesh = scene.getObjectByName(`moon-${moon.name}`);
        if (!moonMesh) return;

        // Obtenir la position mondiale actuelle de la lune
        const currentMoonPosition = new THREE.Vector3();
        moonMesh.getWorldPosition(currentMoonPosition);

        // Calculer le déplacement de la lune depuis la dernière frame
        const moonMovement = currentMoonPosition.clone().sub(lastMoonPosition.current);

        // Si la lune s'est déplacée, suivre le mouvement
        if (moonMovement.length() > 0.001) {
            // Appliquer le déplacement de la lune à la caméra
            const newCameraPosition = controlsRef.current.object.position.clone().add(moonMovement);
            const newTarget = controlsRef.current.target.clone().add(moonMovement);

            // Mettre à jour la position de la caméra et de la cible
            controlsRef.current.object.position.copy(newCameraPosition);
            controlsRef.current.target.copy(newTarget);
            controlsRef.current.update();

            // Sauvegarder la nouvelle position de la lune
            lastMoonPosition.current.copy(currentMoonPosition);
        }
    });

    return null;
};

export default MoonFollower;
