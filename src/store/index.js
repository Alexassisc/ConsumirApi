import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';


import rootReducer from './reducers';
import reduxPersist from './modules/reduxPersist';
import rootSaga from './modules/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: reduxPersist(rootReducer), // ← aplica o persist aqui
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false, // evita avisos do redux-persist
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store;
