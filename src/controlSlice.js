import {createSlice} from '@reduxjs/toolkit';

export const controlSlice = createSlice({
  name: 'icon',
  initialState: {
    value: 'play',
  },
  reducers: {
    play: (state) => {
      state.value = 'play';
    },
    pause: (state) => {
      state.value = 'pause';
    },
  },
});

// Action creators are generated for each case reducer function
export const {play, pause} = controlSlice.actions;

export default controlSlice.reducer;
