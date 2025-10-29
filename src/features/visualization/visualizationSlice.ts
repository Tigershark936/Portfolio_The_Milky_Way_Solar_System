import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface VisualizationState {
    showPlanetNames: boolean;
    showMoonNames: boolean;
    showOrbits: boolean;
    animationSpeed: number;
}

const initialState: VisualizationState = {
    showPlanetNames: false,
    showMoonNames: false,
    showOrbits: false,
    animationSpeed: 1,
};

const visualizationSlice = createSlice({
    name: 'visualization',
    initialState,
    reducers: {
        togglePlanetNames: (state) => {
            state.showPlanetNames = !state.showPlanetNames;
        },
        toggleMoonNames: (state) => {
            state.showMoonNames = !state.showMoonNames;
        },
        toggleOrbits: (state) => {
            state.showOrbits = !state.showOrbits;
        },
        setAnimationSpeed: (state, action: PayloadAction<number>) => {
            state.animationSpeed = action.payload;
        },
        resetToNormalSpeed: (state) => {
            state.animationSpeed = 1;
        },
    },
});

export const {
    togglePlanetNames,
    toggleMoonNames,
    toggleOrbits,
    setAnimationSpeed,
    resetToNormalSpeed,
} = visualizationSlice.actions;

export default visualizationSlice.reducer;

