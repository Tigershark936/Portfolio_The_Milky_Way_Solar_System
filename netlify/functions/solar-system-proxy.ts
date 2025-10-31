import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

/**
 * Netlify Function pour calculer les positions des planètes
 * Utilise les calculs astronomiques côté serveur pour démontrer
 * l'intégration d'une API serverless en production
 */

// Périodes orbitales réelles (en jours)
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

// Distances moyennes du soleil en UA
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
 * Calcule les positions des planètes basées sur le temps actuel
 */
const calculatePlanetPositions = () => {
    const now = new Date();
    const daysSinceReference = (now.getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60 * 24);
    
    const positions = Object.keys(ORBITAL_PERIODS_DAYS).map((planetName) => {
        const orbitalPeriod = ORBITAL_PERIODS_DAYS[planetName];
        const meanDistance = MEAN_DISTANCES_AU[planetName];
        
        // Calculer l'angle basé sur la période orbitale
        const orbitsCompleted = daysSinceReference / orbitalPeriod;
        const angle = (orbitsCompleted % 1) * 2 * Math.PI;
        
        // Convertir en degrés pour l'azimuth
        const azimuth = (angle * 180 / Math.PI) % 360;
        
        return {
            name: planetName,
            ra: angle,
            dec: 0,
            az: azimuth,
            alt: 45,
            distance: meanDistance
        };
    });
    
    return positions;
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // Permettre uniquement les requêtes GET
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        // Calculer les positions des planètes
        const positions = calculatePlanetPositions();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Cache-Control": "public, max-age=3600", // Cache pendant 1 heure
            },
            body: JSON.stringify({
                positions,
                timestamp: new Date().toISOString(),
                source: "netlify-serverless-function",
                calculatedAt: new Date().toISOString()
            }),
        };
    } catch (error) {
        console.error("Error in solar-system-proxy function:", error);
        
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ 
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error"
            }),
        };
    }
};

export { handler };

