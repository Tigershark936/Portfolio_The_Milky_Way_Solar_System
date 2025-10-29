import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type CameraPreset = 'overview' | 'close' | 'far' | 'top' | null;

interface CameraState {
    position: { x: number; y: number; z: number };
    activePreset: CameraPreset;
}

const initialState: CameraState = {
    position: { x: 0, y: 63.16, z: 126.32 },
    activePreset: 'overview',
};

const cameraSlice = createSlice({
    name: 'camera',
    initialState,
    reducers: {
        setCameraPosition: (state, action: PayloadAction<{ x: number; y: number; z: number }>) => {
            state.position = action.payload;
        },
        setCameraPreset: (state, action: PayloadAction<CameraPreset>) => {
            state.activePreset = action.payload;
            
            // Mettre à jour la position selon le preset
            switch (action.payload) {
                case 'overview':
                    state.position = { x: 0, y: 63.16, z: 126.32 };
                    break;
                case 'close':
                    state.position = { x: 0, y: 40, z: 80 };
                    break;
                case 'far':
                    state.position = { x: 0, y: 147.58, z: 295.16 };
                    break;
                case 'top':
                    state.position = { x: 0, y: 330, z: 0 };
                    break;
                default:
                    break;
            }
        },
        resetCamera: (state) => {
            state.position = { x: 0, y: 63.16, z: 126.32 };
            state.activePreset = 'overview';
        },
    },
});

export const {
    setCameraPosition,
    setCameraPreset,
    resetCamera,
} = cameraSlice.actions;

export default cameraSlice.reducer;

