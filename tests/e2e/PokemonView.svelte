 <script>
  import { Out, query } from '../../src/main';
  import { POKEMON_INFO } from './queries';
  import Pokemon from './Pokemon.svelte';

  export let id = '';

  $: query(POKEMON_INFO, { id });
</script>

<Out nostatus from={POKEMON_INFO} let:data>
  <Pokemon info={data.pokemon} />
</Out>
