import { configureStore } from '@reduxjs/toolkit';
import solarSystemReducer from '../features/solarSystem/solarSystemSlice';
import visualizationReducer from '../features/visualization/visualizationSlice';
import cameraReducer from '../features/camera/cameraSlice';
import selectionReducer from '../features/selection/selectionSlice';

export const store = configureStore({
    reducer: {
        solarSystem: solarSystemReducer,
        visualization: visualizationReducer,
        camera: cameraReducer,
        selection: selectionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

