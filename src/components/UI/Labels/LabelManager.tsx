import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

type LabelManagerProps = {
    showPlanetNames: boolean;
    showMoonNames: boolean;
};

const LabelManager = ({ showPlanetNames, showMoonNames }: LabelManagerProps) => {
    const { camera, scene } = useThree();
    const planetLabelsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const moonLabelsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const labelsInitialized = useRef(false);
    const hoveredPlanetsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (labelsInitialized.current) return;
        labelsInitialized.current = true;

        // Ajouter des event listeners sur le canvas pour détecter les hovers
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            const onMouseMove = (event: MouseEvent) => {
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const allObjects: THREE.Object3D[] = [];
                scene.traverse(child => {
                    if (child instanceof THREE.Mesh && child.name && child.name !== 'sun' && child.name !== 'orbitalRing') {
                        allObjects.push(child);
                    }
                });

                const intersects = raycaster.intersectObjects(allObjects);

                // Réinitialiser les planètes survolées
                hoveredPlanetsRef.current.clear();

                // Ajouter les planètes intersectées
                intersects.forEach(intersect => {
                    const obj = intersect.object as THREE.Mesh;
                    if (obj.name && obj.name !== 'sun') {
                        hoveredPlanetsRef.current.add(obj.name);
                    }
                });
            };

            canvas.addEventListener('mousemove', onMouseMove);

            return () => {
                canvas.removeEventListener('mousemove', onMouseMove);
                // Cleanup: supprimer tous les labels
                planetLabelsRef.current.forEach(label => {
                    if (label && label.parentNode) {
                        label.parentNode.removeChild(label);
                    }
                });
                moonLabelsRef.current.forEach(label => {
                    if (label && label.parentNode) {
                        label.parentNode.removeChild(label);
                    }
                });
            };
        }
    }, [camera, scene]);

    useFrame(() => {
        // Trouver toutes les planètes et lunes dans la scène par leur nom
        scene.children.forEach(child => {
            // Traverser récursivement pour trouver les meshes
            const findMeshes = (obj: THREE.Object3D): THREE.Mesh[] => {
                const meshes: THREE.Mesh[] = [];
                if (obj instanceof THREE.Mesh) {
                    meshes.push(obj);
                }
                obj.children.forEach(child => meshes.push(...findMeshes(child)));
                return meshes;
            };

            const meshes = findMeshes(child);
            meshes.forEach(mesh => {
                if (mesh.name) {
                    const name = mesh.name;
                    // Ignorer le soleil pour l'instant
                    if (name === 'sun') return;

                    const isMoon = name.includes('moon');

                    // Créer le label s'il n'existe pas encore
                    if (!planetLabelsRef.current.has(name) && !moonLabelsRef.current.has(name)) {
                        const labelDiv = document.createElement('div');
                        labelDiv.className = isMoon ? 'moon-label' : 'planet-label';

                        // Extraire le nom correct et traduire
                        let displayName = name.replace('planet-', '');

                        if (isMoon) {
                            // Pour les lunes, extraire le nom spécifique après "moon-"
                            displayName = name.replace('moon-', '');
                        } else {
                            // Traduction des noms de planètes en français
                            const planetNamesFR: { [key: string]: string } = {
                                'Mercury': 'Mercure',
                                'Venus': 'Vénus',
                                'Earth': 'Terre',
                                'Mars': 'Mars',
                                'Jupiter': 'Jupiter',
                                'Saturn': 'Saturne',
                                'Uranus': 'Uranus',
                                'Neptune': 'Neptune',
                                'Pluto': 'Pluton'
                            };
                            displayName = planetNamesFR[displayName] || displayName;
                        }

                        labelDiv.textContent = displayName;
                        labelDiv.id = `label-${name}`;
                        labelDiv.style.display = 'none';
                        document.body.appendChild(labelDiv);

                        if (isMoon) {
                            moonLabelsRef.current.set(name, labelDiv);
                        } else {
                            planetLabelsRef.current.set(name, labelDiv);
                        }
                    }

                    // Mettre à jour la position
                    const shouldShow = (isMoon ? showMoonNames : showPlanetNames) || hoveredPlanetsRef.current.has(name);
                    const labelMap = isMoon ? moonLabelsRef.current : planetLabelsRef.current;
                    const label = labelMap.get(name);

                    if (label && shouldShow) {
                        const vector = new THREE.Vector3();
                        mesh.getWorldPosition(vector);
                        vector.project(camera);

                        const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                        const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

                        // Centrer horizontalement et placer au-dessus
                        label.style.left = x + 'px';
                        label.style.top = y + 'px';
                        label.style.transform = 'translate(-50%, calc(-100% - 10px))';

                        if (vector.z > 1) {
                            label.style.display = 'none';
                        } else {
                            label.style.display = 'block';
                        }
                    } else if (label) {
                        label.style.display = 'none';
                    }
                }
            });
        });
    });

    return null;
};

export default LabelManager;

