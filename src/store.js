import {configureStore} from '@reduxjs/toolkit';
import controlReducer from './controlSlice';

export default configureStore({
  reducer: {icon: controlReducer},
});
