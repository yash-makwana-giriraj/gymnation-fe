
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CityLocation {
  cityName: string;
  locations: string[];
}

interface FreeTrialFormState {
  cityLocations: CityLocation[];
  isLoaded: boolean;
}

const initialState: FreeTrialFormState = {
  cityLocations: [],
  isLoaded: false,
};

const freeTrialFormSlice = createSlice({
  name: 'freeTrialForm',
  initialState,
  reducers: {
    setCityLocations: (state, action: PayloadAction<CityLocation[]>) => {
      state.cityLocations = action.payload;
      state.isLoaded = true;
    },
    clearCityLocations: (state) => {
      state.cityLocations = [];
      state.isLoaded = false;
    },
  },
});

export const { setCityLocations, clearCityLocations } = freeTrialFormSlice.actions;
export default freeTrialFormSlice.reducer;