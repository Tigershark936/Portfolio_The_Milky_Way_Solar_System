import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SelectionState {
    selectedPlanet: string | null;
    selectedMoon: string | null;
    isPlanetInfoModalOpen: boolean;
    selectedPlanetData: any | null;
    isSunHovered: boolean;
    hoveredPlanets: string[];
}

const initialState: SelectionState = {
    selectedPlanet: null,
    selectedMoon: null,
    isPlanetInfoModalOpen: false,
    selectedPlanetData: null,
    isSunHovered: false,
    hoveredPlanets: [],
};

const selectionSlice = createSlice({
    name: 'selection',
    initialState,
    reducers: {
        setSelectedPlanet: (state, action: PayloadAction<string | null>) => {
            state.selectedPlanet = action.payload;
            // Désélectionner la lune quand on sélectionne une planète
            if (action.payload) {
                state.selectedMoon = null;
            }
        },
        setSelectedMoon: (state, action: PayloadAction<string | null>) => {
            state.selectedMoon = action.payload;
            // Désélectionner la planète quand on sélectionne une lune
            if (action.payload) {
                state.selectedPlanet = null;
            }
        },
        openPlanetInfoModal: (state, action: PayloadAction<any>) => {
            state.isPlanetInfoModalOpen = true;
            state.selectedPlanetData = action.payload;
        },
        closePlanetInfoModal: (state) => {
            state.isPlanetInfoModalOpen = false;
            state.selectedPlanetData = null;
            state.selectedPlanet = null;
            state.selectedMoon = null;
        },
        setSunHovered: (state, action: PayloadAction<boolean>) => {
            state.isSunHovered = action.payload;
        },
        addHoveredPlanet: (state, action: PayloadAction<string>) => {
            if (!state.hoveredPlanets.includes(action.payload)) {
                state.hoveredPlanets.push(action.payload);
            }
        },
        removeHoveredPlanet: (state, action: PayloadAction<string>) => {
            state.hoveredPlanets = state.hoveredPlanets.filter(p => p !== action.payload);
        },
        clearHoveredPlanets: (state) => {
            state.hoveredPlanets = [];
        },
    },
});

export const {
    setSelectedPlanet,
    setSelectedMoon,
    openPlanetInfoModal,
    closePlanetInfoModal,
    setSunHovered,
    addHoveredPlanet,
    removeHoveredPlanet,
    clearHoveredPlanets,
} = selectionSlice.actions;

export default selectionSlice.reducer;

