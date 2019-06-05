<script context="module">
  import { query, setupClient } from '../../../src/main';
  import { delay } from '../../helpers';

  setupClient({
    url: 'https://graphql-pokemon.now.sh/graphql',
  });

  const GET_POKEMON_INFO = `
    query($name: String!) {
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
