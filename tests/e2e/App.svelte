<script>
  import { Out, query, setupClient } from '../../src/main';

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

  query(GET_POKEMON_INFO, { name: 'Pikachu' });
</script>

<Out nostatus from={GET_POKEMON_INFO} let:data>
  <h3>{data.pokemon.number} &mdash; {data.pokemon.name}</h3>
  <img alt={data.pokemon.name} src={data.pokemon.image} />
</Out>
