// src/store/modules/reduxPersist.js

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persist = (reducer) => {
  return persistReducer(
    {
      key: 'REACT-BASE',
      storage,
      whitelist: ['example'], // reducers que você quer persistir
    },
    reducer
  );
};

export default persist;
