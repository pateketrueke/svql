<script context="module">//
  import { useClient } from '../../../src/main';
  import { delay } from '../../helpers';

  const { query } = useClient({
    url: 'https://graphql-pokemon.now.sh/graphql',
  });

  const GET_POKEMON_INFO = `
    query getPokemonInfo($name: String!) {
      pokemon(name: $name) {
        id name image number
      }
    }
  `;
</script>

<script>
  export let name = 'Pikachu';

  // delayed response for testing purposes
  $: promise = delay(query(GET_POKEMON_INFO, { name }), 1000);
</script>

<slot {promise} />
