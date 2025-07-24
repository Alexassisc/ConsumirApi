import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persist = (reducer) => {
  return persistReducer(
    {
      key: 'REACT-BASE',
      storage,
      whitelist: ['auth'], 
    },
    reducer
  );
};

export default persist;
