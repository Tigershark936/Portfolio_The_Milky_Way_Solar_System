import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type PlanetFollowerProps = {
    selectedPlanet: string | null;
    planets: Array<{ name: string; distance: number; speed: number; angle: number; size: number }>;
    controlsRef: React.RefObject<any>;
};

const PlanetFollower = ({ selectedPlanet, planets, controlsRef }: PlanetFollowerProps) => {
    const isFollowing = useRef(false);
    const lastPlanetPosition = useRef(new THREE.Vector3());
    const followOffset = useRef(new THREE.Vector3());
    const userCameraOffset = useRef(new THREE.Vector3());
    const { scene } = useThree();

    useEffect(() => {
        isFollowing.current = !!selectedPlanet;

        if (!controlsRef.current) return;

        // Si aucune planète n'est sélectionnée, restaurer les limites de zoom par défaut
        if (!selectedPlanet) {
            controlsRef.current.minDistance = 30;
            controlsRef.current.maxDistance = 330;
            return;
        }

        // Positionner immédiatement la caméra sur la planète au moment de la sélection
        const planet = planets.find(p => p.name === selectedPlanet);
        if (planet) {
            console.log(`🎯 Following planet: ${selectedPlanet}`);

            // Trouver le mesh de la planète dans la scène
            const planetMesh = scene.getObjectByName(`planet-${planet.name}`);
            if (!planetMesh) {
                console.warn(`Planet mesh not found: planet-${planet.name}`);
                return;
            }

            // Obtenir la position mondiale réelle de la planète
            const planetPosition = new THREE.Vector3();
            planetMesh.getWorldPosition(planetPosition);

            // Distance adaptée à la taille de la planète
            const distanceFromPlanet = Math.max(planet.size * 8, 15);
            const height = distanceFromPlanet * 0.5;

            // Calculer la direction de la planète par rapport au soleil
            const direction = planetPosition.clone().normalize();
            const cameraOffset = direction.clone().multiplyScalar(-distanceFromPlanet);
            cameraOffset.y = height;

            const cameraPosition = planetPosition.clone().add(cameraOffset);

            // Mettre à jour la caméra et la cible immédiatement
            const camera = controlsRef.current.object;
            const target = controlsRef.current.target;

            camera.position.copy(cameraPosition);
            target.copy(planetPosition);

            // Configurer les limites de zoom pour cette planète
            controlsRef.current.minDistance = distanceFromPlanet * 0.5;
            controlsRef.current.maxDistance = distanceFromPlanet * 3;

            // Réinitialiser les positions de suivi
            lastPlanetPosition.current.set(0, 0, 0);
            followOffset.current.copy(cameraOffset);
            userCameraOffset.current.set(0, 0, 0);

            controlsRef.current.update();
        }
    }, [selectedPlanet, planets, scene, controlsRef]);

    useFrame(() => {
        if (!isFollowing.current || !selectedPlanet || !controlsRef.current) return;

        const planet = planets.find(p => p.name === selectedPlanet);
        if (!planet) return;

        // Trouver le mesh de la planète dans la scène
        const planetMesh = scene.getObjectByName(`planet-${planet.name}`);
        if (!planetMesh) return;

        // Obtenir la position mondiale réelle de la planète
        const planetPosition = new THREE.Vector3();
        planetMesh.getWorldPosition(planetPosition);

        // Suivi de la planète
        const camera = controlsRef.current.object;
        const target = controlsRef.current.target;

        // Calculer le mouvement de la planète
        const planetMovement = planetPosition.clone().sub(lastPlanetPosition.current);

        if (!lastPlanetPosition.current.equals(new THREE.Vector3(0, 0, 0))) {
            // Déplacer la caméra avec la planète
            camera.position.add(planetMovement);
            target.add(planetMovement);
        } else {
            // Position initiale - placer la caméra derrière la planète
            const distanceFromPlanet = Math.max(planet.size * 8, 15);
            const height = distanceFromPlanet * 0.5;

            // Calculer la direction de la planète par rapport au soleil
            const direction = planetPosition.clone().normalize();
            const cameraOffset = direction.clone().multiplyScalar(-distanceFromPlanet);
            cameraOffset.y = height;

            const cameraPosition = planetPosition.clone().add(cameraOffset);

            camera.position.copy(cameraPosition);
            target.copy(planetPosition);
            followOffset.current.copy(cameraOffset);
        }

        lastPlanetPosition.current.copy(planetPosition);
        controlsRef.current.update();
    });

    return null; // Ce composant ne rend rien, il ne fait que suivre
};

export default PlanetFollower;
