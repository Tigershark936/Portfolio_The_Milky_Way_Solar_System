import { useState, useCallback } from 'react';
import { fetchRealPlanetPositions, type PlanetPosition } from '../data/planetPositionsApi';
import type { Planet as PlanetType } from '../types/SolarSystemDetails';

/**
 * Hook React pour récupérer et gérer les positions réelles des planètes via l'API
 * @param planets - Liste des planètes actuelles
 * @returns Fonction pour charger les positions réelles et état de chargement
 */
export const useFetchPlanetPositions = (_planets: PlanetType[]) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Fonction pour charger les positions réelles des planètes depuis l'API
     * Cette fonction force un repositionnement immédiat et fluide à la position exacte de l'orbite
     */
    const loadRealPositions = useCallback(async (): Promise<PlanetPosition[]> => {
        setIsLoading(true);
        setError(null);

        try {
            const realPositions = await fetchRealPlanetPositions();
            setIsLoading(false);
            return realPositions;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Erreur lors du chargement des positions');
            setError(error);
            setIsLoading(false);
            throw error;
        }
    }, []);

    return {
        loadRealPositions,
        isLoading,
        error,
    };
};

