import { all } from 'redux-saga/effects';

import auth from './examples/sagas';

export default function* rootSaga() {
  return yield all([auth]);
}
