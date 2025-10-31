// Service pour récupérer les positions réelles des planètes via l'API
// Avec fallback sur calcul local si l'API n'est pas disponible

export type PlanetPosition = {
    name: string;
    distance: number; // Distance en UA (unités astronomiques)
    angle: number; // Angle en radians (0 à 2π)
};

// Mapping des noms de planètes entre notre système et l'API
// L'API renvoie les noms en français avec la première lettre en majuscule
const PLANET_NAME_MAP: Record<string, string[]> = {
    'Mercury': ['mercure', 'Mercure'],
    'Venus': ['venus', 'Venus'],
    'Earth': ['terre', 'Terre', 'earth', 'Earth'],
    'Mars': ['mars', 'Mars'],
    'Jupiter': ['jupiter', 'Jupiter'],
    'Saturn': ['saturne', 'Saturne'],
    'Uranus': ['uranus', 'Uranus'],
    'Neptune': ['neptune', 'Neptune'],
    'Pluto': ['pluton', 'Pluton'],
};

// Périodes orbitales réelles (en jours) - pour le calcul local de fallback
const ORBITAL_PERIODS_DAYS: Record<string, number> = {
    'Mercury': 87.97,
    'Venus': 224.70,
    'Earth': 365.25,
    'Mars': 686.98,
    'Jupiter': 4332.59,
    'Saturn': 10759.22,
    'Uranus': 30688.5,
    'Neptune': 60182,
    'Pluto': 90560,
};

// Distances moyennes du soleil en UA (Unités Astronomiques)
const MEAN_DISTANCES_AU: Record<string, number> = {
    'Mercury': 0.387,
    'Venus': 0.723,
    'Earth': 1.0,
    'Mars': 1.524,
    'Jupiter': 5.203,
    'Saturn': 9.537,
    'Uranus': 19.191,
    'Neptune': 30.069,
    'Pluto': 39.482,
};

// Date de référence : 1er janvier 2000, 12:00 UTC (J2000.0)
const REFERENCE_DATE = new Date('2000-01-01T12:00:00Z');

/**
 * Essaie de récupérer les positions via l'API avec la clé API
 * Utilise le proxy Vite pour contourner CORS
 */
async function fetchPositionsFromAPI(): Promise<PlanetPosition[]> {
    try {
        // Date actuelle en UTC
        const now = new Date();

        // Format datetime ISO 8601 : yyyy-MM-ddThh:mm:ss
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hour = String(now.getUTCHours()).padStart(2, '0');
        const minute = String(now.getUTCMinutes()).padStart(2, '0');
        const second = String(now.getUTCSeconds()).padStart(2, '0');

        // Format ISO 8601 : yyyy-MM-ddThh:mm:ss
        const datetime = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

        // Timezone offset pour Paris : UTC+1 en hiver, UTC+2 en été
        // Pour simplifier, on utilise UTC+1 (on pourrait calculer DST, mais UTC+1 fonctionne)
        const timezoneOffset = 1; // Europe/Paris = UTC+1

        // Utiliser le proxy Vite en dev, Netlify Function en production
        const isProduction = import.meta.env.PROD;
        const proxyUrl = isProduction 
            ? '/.netlify/functions/solar-system-proxy'
            : '/api/solar-system/rest/positions';
        const url = new URL(proxyUrl, window.location.origin);

        // Paramètres selon la documentation OpenAPI
        url.searchParams.append('lat', '48.8566');
        url.searchParams.append('lon', '2.3522');
        url.searchParams.append('elev', '0');
        url.searchParams.append('datetime', datetime); // Format ISO 8601 : yyyy-MM-ddThh:mm:ss
        url.searchParams.append('zone', timezoneOffset.toString()); // Entier de -12 à +14

        // console.log(`Tentative de récupération depuis l'API: ${url.toString()}`);
        // console.log(`Paramètres: lat=48.8566, lon=2.3522, elev=0, datetime=${datetime}, zone=${timezoneOffset}`);
        // console.log(`URL complète décodée:`, decodeURIComponent(url.toString()));
        // console.log(`Tous les params:`, Array.from(url.searchParams.entries()));

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                // Le proxy ajoute automatiquement la clé API via Authorization: Bearer
            },
        });

        // Récupérer le message d'erreur si disponible
        if (!response.ok) {
            let errorMessage = `Erreur API: ${response.status} - ${response.statusText}`;
            try {
                const errorData = await response.text();
                // console.error('Réponse d\'erreur de l\'API:', errorData);
                if (errorData) {
                    errorMessage += ` - ${errorData}`;
                }
            } catch (e) {
                // Ignorer les erreurs de parsing
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        // console.log('Données reçues de l\'API:', data);

        const positions: PlanetPosition[] = [];

        // Parser la réponse selon la documentation OpenAPI
        // L'API retourne un objet avec une propriété "positions" qui est un array
        // Chaque élément a : name, ra (right ascension), dec (declination), az (azimuth), alt (altitude)
        const positionsArray = data.positions || [];

        // console.log(`${positionsArray.length} objets reçus de l'API. Noms:`, positionsArray.map((p: any) => p?.name).filter(Boolean));

        positionsArray.forEach((planetData: any) => {
            if (planetData && planetData.name) {
                // L'API peut renvoyer les noms avec différentes casse (Soleil, Lune, Mercure, Venus, etc.)
                const apiName = planetData.name;

                // Trouver le nom correspondant dans notre mapping
                // Le mapping accepte maintenant plusieurs variantes
                const ourName = Object.entries(PLANET_NAME_MAP).find(
                    ([_, apiNameVariants]) => {
                        // Vérifier si le nom de l'API correspond à une des variantes
                        return apiNameVariants.some(variant =>
                            variant.toLowerCase() === apiName.toLowerCase()
                        );
                    }
                )?.[0];

                if (ourName) {
                    // console.log(`${ourName} trouvé dans les données API`);
                    // L'API retourne des coordonnées horizontales (az, alt)
                    // Pour obtenir l'angle orbital, on pourrait utiliser ra (right ascension)
                    // mais pour simplifier, on va utiliser une conversion approximative
                    // ou on pourrait utiliser ra directement pour l'angle

                    // Pour l'instant, utilisons une conversion approximative depuis az (azimuth)
                    // Note: az est l'azimut (0-360°), on peut l'utiliser comme angle orbital approximatif
                    let angle = 0;

                    if (planetData.az !== undefined) {
                        // Convertir az de degrés en radians
                        const azDegrees = parseFloat(planetData.az);
                        if (!isNaN(azDegrees)) {
                            angle = (azDegrees * Math.PI) / 180;
                            // Normaliser entre 0 et 2π
                            if (angle < 0) angle += Math.PI * 2;
                        }
                    }

                    // Distance moyenne depuis notre configuration
                    const meanDistance = MEAN_DISTANCES_AU[ourName] || 1.0;

                    positions.push({
                        name: ourName,
                        distance: meanDistance,
                        angle: angle,
                    });
                } else {
                    // Ignorer silencieusement le Soleil et la Lune (gérés séparément)
                    if (planetData.name.toLowerCase() !== 'soleil' && planetData.name.toLowerCase() !== 'lune') {
                        // console.warn(`Planète "${planetData.name}" non mappée (ignorée)`);
                    }
                }
            }
        });

        // Si la Terre n'est pas dans les résultats de l'API, la calculer localement
        // (l'API ne retourne généralement pas la Terre car elle est le point d'observation)
        const hasEarth = positions.some(p => p.name === 'Earth');
        if (!hasEarth) {
            // console.log('Terre non trouvée dans l\'API, calcul local...');
            const earthPosition = calculateEarthPositionLocally();
            if (earthPosition) {
                positions.push(earthPosition);
                // console.log(`Position de la Terre calculée: ${(earthPosition.angle * 180 / Math.PI).toFixed(2)}°`);
            }
        }

        if (positions.length > 0) {
            // console.log(`${positions.length} positions récupérées depuis l'API (incluant ${hasEarth ? 'la Terre depuis l\'API' : 'la Terre calculée localement'})`);
            return positions;
        }

        // Si aucune position trouvée mais la réponse est valide, essayer de parser différemment
        // console.warn('Aucune position trouvée dans le format attendu. Données complètes:', data);
        throw new Error('Aucune position trouvée dans la réponse API');
    } catch (error) {
        // console.error('Erreur détaillée avec l\'API:', error);
        throw error;
    }
}

/**
 * Calcule uniquement la position de la Terre localement
 * (utilisé quand l'API ne retourne pas la Terre)
 */
function calculateEarthPositionLocally(): PlanetPosition | null {
    try {
        const now = new Date();

        // Calculer le nombre de jours écoulés depuis la date de référence (J2000.0)
        const daysSinceReference = (now.getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60 * 24);

        const orbitalPeriod = ORBITAL_PERIODS_DAYS['Earth'];
        const meanDistance = MEAN_DISTANCES_AU['Earth'];

        if (orbitalPeriod && meanDistance) {
            // Calculer combien de tours complets la Terre a effectués depuis la date de référence
            const revolutions = daysSinceReference / orbitalPeriod;

            // Extraire la partie fractionnaire (position dans l'orbite actuelle)
            const currentPosition = revolutions % 1;

            // Angle initial de référence : 0° le 1er janvier (approximatif)
            const initialAngle = 0;

            // Angle actuel = angle initial + position dans l'orbite actuelle
            let angle = initialAngle + (currentPosition * 2 * Math.PI);

            // Normaliser entre 0 et 2π
            angle = angle % (Math.PI * 2);
            if (angle < 0) angle += Math.PI * 2;

            return {
                name: 'Earth',
                distance: meanDistance,
                angle: angle,
            };
        }

        return null;
    } catch (error) {
        // console.warn('Erreur lors du calcul local de la Terre:', error);
        return null;
    }
}

/**
 * Calcule les positions localement basées sur la date actuelle (fallback)
 */
function calculatePositionsLocally(): PlanetPosition[] {
    try {
        const now = new Date();

        // Calculer le nombre de jours écoulés depuis la date de référence
        const daysSinceReference = (now.getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60 * 24);

        const positions: PlanetPosition[] = [];

        // Calculer la position de chaque planète
        Object.keys(ORBITAL_PERIODS_DAYS).forEach(planetName => {
            const orbitalPeriod = ORBITAL_PERIODS_DAYS[planetName];
            const meanDistance = MEAN_DISTANCES_AU[planetName];

            if (orbitalPeriod && meanDistance) {
                // Calculer combien de tours complets la planète a effectués depuis la date de référence
                const revolutions = daysSinceReference / orbitalPeriod;

                // Extraire la partie fractionnaire (position dans l'orbite actuelle)
                const currentPosition = revolutions % 1;

                // Convertir en angle en radians (0 à 2π)
                // Angle initial de référence (approximatif pour aligner les planètes)
                const initialAngles: Record<string, number> = {
                    'Mercury': 0.1 * Math.PI,
                    'Venus': 0.3 * Math.PI,
                    'Earth': 0.0 * Math.PI, // Terre à 0° le 1er janvier (approximatif)
                    'Mars': 0.5 * Math.PI,
                    'Jupiter': 0.7 * Math.PI,
                    'Saturn': 0.9 * Math.PI,
                    'Uranus': 1.1 * Math.PI,
                    'Neptune': 1.3 * Math.PI,
                    'Pluto': 1.5 * Math.PI,
                };

                const initialAngle = initialAngles[planetName] || 0;

                // Angle actuel = angle initial + position dans l'orbite actuelle
                let angle = initialAngle + (currentPosition * 2 * Math.PI);

                // Normaliser entre 0 et 2π
                angle = angle % (Math.PI * 2);
                if (angle < 0) angle += Math.PI * 2;

                positions.push({
                    name: planetName,
                    distance: meanDistance,
                    angle: angle,
                });
            }
        });

        if (positions.length > 0) {
            // console.log(`${positions.length} positions calculées localement pour la date du ${now.toLocaleDateString()}`);
            return positions;
        }

        return getDefaultPositions();
    } catch (error) {
        // console.warn('Erreur lors du calcul local:', error);
        return getDefaultPositions();
    }
}

/**
 * Récupère les positions réelles des planètes
 * Essaie d'abord l'API via le proxy Vite, puis utilise le calcul local en fallback
 * @returns Promise avec les positions des planètes
 */
export const fetchRealPlanetPositions = async (): Promise<PlanetPosition[]> => {
    // Essayer d'abord avec l'API (via proxy Vite en dev ou Netlify Function en prod)
    try {
        const apiPositions = await fetchPositionsFromAPI();
        if (apiPositions.length > 0) {
            // console.log(`✅ ${apiPositions.length} positions récupérées depuis l'API`);
            return apiPositions;
        }
    } catch (error) {
        // Fallback silencieux sur le calcul local
        // console.warn('⚠️ L\'API a échoué, utilisation du calcul local comme fallback...', error);
    }

    // Fallback sur le calcul local (plus fiable et rapide)
    // console.log('📊 Utilisation du calcul local des positions planétaires');
    return calculatePositionsLocally();
};

/**
 * Retourne des positions par défaut (utilisé comme fallback)
 */
const getDefaultPositions = (): PlanetPosition[] => {
    return [
        { name: 'Mercury', distance: 0.387, angle: 0.1 * Math.PI },
        { name: 'Venus', distance: 0.723, angle: 0.3 * Math.PI },
        { name: 'Earth', distance: 1.0, angle: 0 },
        { name: 'Mars', distance: 1.524, angle: 0.5 * Math.PI },
        { name: 'Jupiter', distance: 5.203, angle: 0.7 * Math.PI },
        { name: 'Saturn', distance: 9.537, angle: 0.9 * Math.PI },
        { name: 'Uranus', distance: 19.191, angle: 1.1 * Math.PI },
        { name: 'Neptune', distance: 30.069, angle: 1.3 * Math.PI },
        { name: 'Pluto', distance: 39.482, angle: 1.5 * Math.PI },
    ];
};

/**
 * Convertit une distance en UA vers une distance pour notre scène 3D
 * Notre système utilise des distances relatives pour l'affichage
 */
export const convertDistanceToSceneScale = (distanceAU: number, baseDistance: number): number => {
    // Les distances dans notre scène sont déjà ajustées pour la visualisation
    // On garde les proportions relatives entre les planètes
    // On utilise un facteur d'échelle pour adapter aux distances de notre scène
    const scaleFactor = baseDistance / 1.0; // Terre = distance de référence

    // Convertir la distance réelle en UA vers notre échelle de scène
    return distanceAU * scaleFactor;
};

