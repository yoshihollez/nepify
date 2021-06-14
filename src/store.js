import {configureStore} from '@reduxjs/toolkit';
import controlReducer from './controlSlice';
import playListReducer from './PlayListSlice';

export default configureStore({
  reducer: {icon: controlReducer, playList: playListReducer},
});
