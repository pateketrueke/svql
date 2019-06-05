<script>
  import { Out } from '../../../src/main';
  import PokemonInfo from './PokemonInfo.svelte';

  export let router = null;
  export let name = null;

  $: fixedName = router ? router.params.name : name;
</script>

<PokemonInfo name={fixedName} let:promise>
  <Out nostatus from={promise} let:data>
    <h3 slot="failure">Pokémon not found!</h3>
    <h3>{data.pokemon.number}. {data.pokemon.name}</h3>
    <img alt={data.pokemon.name} src={data.pokemon.image} />
  </Out>
</PokemonInfo>
