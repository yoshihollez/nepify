import {createSlice} from '@reduxjs/toolkit';

export const PlayListSlice = createSlice({
  name: 'playList',
  initialState: {
    playList: [],
    playListName: 'PlayList',
    playListsNames: [{label: 'test', value: 'PlayList'}],
  },
  reducers: {
    setPlayList: (state, action) => {
      state.playList = action.payload;
    },
    setPlayListName: (state, action) => {
      state.playListName = action.payload;
    },
    setPlayListsNames: (state, action) => {
      state.playListsNames = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setPlayList,
  setPlayListName,
  setPlayListsNames,
} = PlayListSlice.actions;

export default PlayListSlice.reducer;
