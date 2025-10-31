import { useMemo, useRef, useEffect } from 'react';
import { MathUtils, Matrix4, Vector3, InstancedMesh, SphereGeometry, MeshBasicMaterial, Color } from 'three';
import { useFrame } from '@react-three/fiber';

type AsteroidBeltProps = {
    innerRadius?: number; // Rayon interne de la ceinture (échelle scène)
    outerRadius?: number; // Rayon externe de la ceinture (échelle scène)
    count?: number; // Nombre total d'astéroïdes
    inclinationDeg?: number; // Inclinaison orbitale moyenne en degrés
    thickness?: number; // Épaisseur verticale (demi-épaisseur)
};

const AsteroidBelt = ({
    innerRadius = 41,
    outerRadius = 52,
    count = 6000,
    inclinationDeg = 2,
    thickness = 1.6,
}: AsteroidBeltProps) => {
    // Références vers les 6 couches
    const layerRefs = useRef<InstancedMesh[]>([]);
    // Données par couche (radii, angles, vitesses, hauteurs)
    const radiiRef = useRef<Float32Array[]>([]);
    const anglesRef = useRef<Float32Array[]>([]);
    const speedsRef = useRef<Float32Array[]>([]);
    const heightsRef = useRef<Float32Array[]>([]);

    // Inclinaison convertie en radians
    const incRad = MathUtils.degToRad(inclinationDeg);

    // Définition des 6 couches : tailles fixes + couleurs demandées
    const layers = useMemo(() => {
        const sizes = [0.03, 0.04, 0.05, 0.07, 0.04, 0.05];
        const colors = ['#3A3A3A', '#9E9480', '#A5A9AC', '#7B8A99', '#7E4B2F', '#6C5242'];
        return sizes.map((s, i) => ({ size: s, color: new Color(colors[i]) }));
    }, []);

    // Géométries et matériaux pour chaque couche
    const geomsMats = useMemo(() => {
        return layers.map(l => ({
            geom: new SphereGeometry(l.size, 8, 8),
            mat: new MeshBasicMaterial({ color: l.color })
        }));
    }, [layers]);

    useEffect(() => {
        // Répartition du nombre d'astéroïdes sur 6 couches
        const base = Math.floor(count / layers.length);
        const counts = Array(layers.length).fill(base) as number[];
        counts[counts.length - 1] += count - base * layers.length; // Ajuste le reste sur la dernière couche

        // (Ré)initialiser les tableaux par couche
        radiiRef.current = [];
        anglesRef.current = [];
        speedsRef.current = [];
        heightsRef.current = [];

        for (let li = 0; li < layers.length; li++) {
            const n = counts[li];
            const radii = new Float32Array(n);
            const angles = new Float32Array(n);
            const speeds = new Float32Array(n);
            const heights = new Float32Array(n);

            // Génération des paramètres orbitaux pour chaque astéroïde
            for (let i = 0; i < n; i++) {
                const r = MathUtils.lerp(innerRadius, outerRadius, Math.pow(Math.random(), 0.9));
                radii[i] = r * (1.0 + (Math.random() - 0.5) * 0.03); // Légère excentricité
                angles[i] = Math.random() * Math.PI * 2; // Angle initial aléatoire
                speeds[i] = MathUtils.lerp(0.0006, 0.0012, 1 - (r - innerRadius) / (outerRadius - innerRadius)); // Plus proche → plus rapide
                heights[i] = (Math.random() - 0.5) * 2 * thickness; // Dispersion verticale
            }

            radiiRef.current.push(radii);
            anglesRef.current.push(angles);
            speedsRef.current.push(speeds);
            heightsRef.current.push(heights);

            // Positionnement initial dans la scène
            const ref = layerRefs.current[li];
            if (!ref) continue;
            const m = new Matrix4();
            const t = new Vector3();
            for (let i = 0; i < n; i++) {
                const radius = radii[i];
                const theta = angles[i];
                const y0 = heights[i];
                const x = Math.cos(theta) * radius;
                const z0 = Math.sin(theta) * radius;
                // Appliquer l'inclinaison autour de l'axe X
                const y = y0 * Math.cos(incRad) - z0 * Math.sin(incRad);
                const z = y0 * Math.sin(incRad) + z0 * Math.cos(incRad);
                t.set(x, y, z);
                m.makeTranslation(t.x, t.y, t.z);
                ref.setMatrixAt(i, m);
            }
            ref.instanceMatrix.needsUpdate = true;
        }
    }, [count, innerRadius, outerRadius, thickness, incRad, layers.length]);

    useFrame((_, delta) => {
        // Mise à jour continue des positions (orbite) pour chaque couche
        for (let li = 0; li < layers.length; li++) {
            const ref = layerRefs.current[li];
            const radii = radiiRef.current[li];
            const angles = anglesRef.current[li];
            const speeds = speedsRef.current[li];
            const heights = heightsRef.current[li];
            if (!ref || !radii || !angles || !speeds || !heights) continue;
            const m = new Matrix4();
            const t = new Vector3();
            for (let i = 0; i < radii.length; i++) {
                angles[i] += speeds[i] * delta * 60; // Indépendant du framerate
                const radius = radii[i];
                const theta = angles[i];
                const y0 = heights[i];
                const x = Math.cos(theta) * radius;
                const z0 = Math.sin(theta) * radius;
                const y = y0 * Math.cos(incRad) - z0 * Math.sin(incRad);
                const z = y0 * Math.sin(incRad) + z0 * Math.cos(incRad);
                t.set(x, y, z);
                m.makeTranslation(t.x, t.y, t.z);
                ref.setMatrixAt(i, m);
            }
            ref.instanceMatrix.needsUpdate = true;
        }
    });

    // Préparer les quantités à instancier par couche (répartition égale)
    const base = Math.floor(count / layers.length);
    const counts = Array(layers.length).fill(base) as number[];
    counts[counts.length - 1] += count - base * layers.length;

    return (
        <>
            {layers.map((_, i) => (
                <instancedMesh
                    key={`belt-layer-${i}`}
                    ref={(el) => {
                        if (el) {
                            layerRefs.current[i] = el;
                        }
                    }}
                    args={[geomsMats[i].geom, geomsMats[i].mat, counts[i]]}
                    frustumCulled={false}
                />
            ))}
        </>
    );
};

export default AsteroidBelt;


