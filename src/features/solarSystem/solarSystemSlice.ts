import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Planet } from '../../types/Planet';
import type { PlanetPosition } from '../../data/planetPositionsApi';

// Données de base des planètes (sera initialisé avec les positions réelles)
const ORBITAL_PERIODS_DAYS: Record<string, number> = {
    'Mercury': 88,
    'Venus': 225,
    'Earth': 365.25,
    'Mars': 687,
    'Jupiter': 4331,
    'Saturn': 10747,
    'Uranus': 30589,
    'Neptune': 59800,
    'Pluto': 90520,
};

const basePlanets: Planet[] = [
    { name: 'Mercury', distance: 16, size: 0.23, color: '#B8860B', speed: ORBITAL_PERIODS_DAYS.Earth / ORBITAL_PERIODS_DAYS.Mercury, angle: 0 },
    { name: 'Venus', distance: 22, size: 0.57, color: '#ffc649', speed: ORBITAL_PERIODS_DAYS.Earth / ORBITAL_PERIODS_DAYS.Venus, angle: 0 },
    { name: 'Earth', distance: 31, size: 0.3, color: '#6b93d6', speed: 1, angle: 0 },
    { name: 'Mars', distance: 40, size: 0.32, color: '#cd5c5c', speed: ORBITAL_PERIODS_DAYS.Earth / ORBITAL_PERIODS_DAYS.Mars, angle: 0 },
    { name: 'Jupiter', distance: 60, size: 8.97, color: '#d8ca9d', speed: ORBITAL_PERIODS_DAYS.Earth / ORBITAL_PERIODS_DAYS.Jupiter, angle: 0 },
    { name: 'Saturn', distance: 85, size: 6.62, color: '#fad5a5', speed: ORBITAL_PERIODS_DAYS.Earth / ORBITAL_PERIODS_DAYS.Saturn, angle: 0 },
    { name: 'Uranus', distance: 110, size: 2.01, color: '#4fd0e7', speed: ORBITAL_PERIODS_DAYS.Earth / ORBITAL_PERIODS_DAYS.Uranus, angle: 0 },
    { name: 'Neptune', distance: 135, size: 1.94, color: '#4b70dd', speed: ORBITAL_PERIODS_DAYS.Earth / ORBITAL_PERIODS_DAYS.Neptune, angle: 0 },
    { name: 'Pluto', distance: 160, size: 0.14, color: '#8c7853', speed: ORBITAL_PERIODS_DAYS.Earth / ORBITAL_PERIODS_DAYS.Pluto, angle: 0 },
];

interface SolarSystemState {
    planets: Planet[];
    isLoadingPositions: boolean;
    positionsError: string | null;
}

const initialState: SolarSystemState = {
    planets: basePlanets,
    isLoadingPositions: false,
    positionsError: null,
};

const solarSystemSlice = createSlice({
    name: 'solarSystem',
    initialState,
    reducers: {
        setPlanets: (state, action: PayloadAction<Planet[]>) => {
            state.planets = action.payload;
        },
        updatePlanetAngle: (state, action: PayloadAction<{ name: string; angle: number }>) => {
            const planet = state.planets.find(p => p.name === action.payload.name);
            if (planet) {
                planet.angle = action.payload.angle;
            }
        },
        updatePlanetsFromPositions: (state, action: PayloadAction<PlanetPosition[]>) => {
            state.planets = state.planets.map(planet => {
                const realPosition = action.payload.find(p => p.name === planet.name);
                if (realPosition) {
                    return {
                        ...planet,
                        angle: realPosition.angle,
                    };
                }
                return planet;
            });
        },
        setLoadingPositions: (state, action: PayloadAction<boolean>) => {
            state.isLoadingPositions = action.payload;
        },
        setPositionsError: (state, action: PayloadAction<string | null>) => {
            state.positionsError = action.payload;
        },
    },
});

export const {
    setPlanets,
    updatePlanetAngle,
    updatePlanetsFromPositions,
    setLoadingPositions,
    setPositionsError,
} = solarSystemSlice.actions;

export default solarSystemSlice.reducer;

