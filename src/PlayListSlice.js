import {createSlice} from '@reduxjs/toolkit';

export const PlayListSlice = createSlice({
  name: 'playList',
  initialState: {
    value: [],
  },
  reducers: {
    setPlayList: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setPlayList} = PlayListSlice.actions;

export default PlayListSlice.reducer;
