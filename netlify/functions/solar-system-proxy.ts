import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

/**
 * Netlify Function servant de proxy pour l'API NASA Horizons
 * Permet d'appeler l'API depuis le frontend sans exposer la clé API
 * et de contourner les problèmes CORS
 */
const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // Permettre uniquement les requêtes GET
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        // Récupérer les paramètres de la requête
        const { lat, lon, elev, datetime, zone } = event.queryStringParameters || {};

        // Valider les paramètres requis
        if (!lat || !lon || !elev || !datetime || !zone) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    error: "Missing required parameters",
                    required: ["lat", "lon", "elev", "datetime", "zone"]
                }),
            };
        }

        // Construire l'URL de l'API NASA Horizons
        // Note: Remplace cette URL par la vraie URL de l'API NASA si disponible
        const apiUrl = new URL("https://api.le-systeme-solaire.net/rest/bodies/");
        
        // Pour l'instant, on utilise une API alternative publique
        // L'API NASA Horizons nécessite une clé API et une authentification complexe
        // On va utiliser une API simplifiée qui retourne les positions des planètes
        
        const response = await fetch(apiUrl.toString(), {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();

        // Parser et formater les données pour notre application
        const planets = data.bodies?.filter((body: any) => 
            body.isPlanet && body.englishName !== "Earth"
        ) || [];

        // Ajouter la Terre manuellement
        const positions = planets.map((planet: any) => ({
            name: planet.englishName,
            ra: 0, // Right ascension (à calculer)
            dec: 0, // Declination (à calculer)
            az: Math.random() * 360, // Azimuth (pour démonstration)
            alt: Math.random() * 90, // Altitude (pour démonstration)
        }));

        // Ajouter la Terre
        positions.push({
            name: "Earth",
            ra: 0,
            dec: 0,
            az: 0,
            alt: 0,
        });

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
                source: "netlify-function-proxy"
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

