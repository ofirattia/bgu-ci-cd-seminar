import {
  GET_POKEMONS_REQUEST,
  GET_POKEMONS_SUCCESS,
  GET_POKEMONS_FAIL,
  SET_POKEMONS,
  FILTER_POKEMONS
} from '../constants/page'

const initialState = {
  isFetched: false,
  error: null,
  pokemons: [],
  displayedPokemons: []
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_POKEMONS_REQUEST:
      return {
        ...state,
        isFetched: true
      }

    case GET_POKEMONS_SUCCESS:
      return {
        ...state,
        isFetched: false
      }

    case GET_POKEMONS_FAIL:
      return {
        ...state,
        isFetched: false,
        error: action.payload
      }

    case SET_POKEMONS:
      return {
        ...state,
        pokemons: action.payload
      }

    case FILTER_POKEMONS:
      const { displayedPokemons, searchString } = action.payload
      let filteredDisplayedPokemons = displayedPokemons.filter(pokemon => {
        return pokemon.name.includes(searchString.toLowerCase())
      })
      return {
        ...state,
        displayedPokemons: filteredDisplayedPokemons
      }

    default:
      return state
  }
}
