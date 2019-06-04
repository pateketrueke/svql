<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { Out, query } from '../../src/main';
  import { GET_POKEMONS } from './queries';

  const dispatch = createEventDispatcher();

  export let max = 10;

  onMount(() => {
    query(GET_POKEMONS, { count: max });
  });
</script>

<style>
  ul {
    padding: 0;
    list-style: none;
  }

  a {
    text-decoration: none;
    display: block;
    padding: .5em;
    font-size: 120%;
  }

  a:hover {
    background-color: #cfcfcf;
  }
</style>

<ul>
  <Out nostatus from={GET_POKEMONS} let:data>
    {#each data.pokemons as pokemon (pokemon.id)}
      <li>
        <a href="/{pokemon.id}" on:click|preventDefault={() => dispatch('change', pokemon)}>{pokemon.number}. {pokemon.name}</a>
      </li>
    {/each}
  </Out>
</ul>
