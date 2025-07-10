import * as types from '../modules/types';
const initialState = {
  clicked: false,
};

export default function exampleReducer(state = initialState, action) {
  switch (action.type) {
    case types.BOTAO_CLICADO_SUCCESS:
      console.log('Sucesso!');
      return {
        ...state,
        clicked: !state.clicked,
      };

    case types.BOTAO_CLICADO_FAILURE: {
      console.log('Deu erro!');
      return state;
    }

    case types.BOTAO_CLICADO_REQUEST: {
      console.log('Estou fazendo a requisição');
      return state;
    }

    default:
      return state;
  }
}
