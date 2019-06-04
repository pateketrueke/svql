export const GET_POKEMONS = `
  query($count: Int!) {
    pokemons(first: $count) {
      id name number
    }
  }
`;

export const POKEMON_INFO = `
  query($id: String!) {
    pokemon(id: $id) {
      id name image number
    }
  }
`;
