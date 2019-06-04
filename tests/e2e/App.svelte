<script context="module">
  import { Router, Route, navigateTo } from 'svero';
  import { setupClient, query, In } from '../../src/main';
  import PokemonList from './PokemonList.svelte';
  import PokemonView from './PokemonView.svelte';

  setupClient({
    url: 'https://graphql-pokemon.now.sh/graphql',
  });
</script>

<Router>
  <PokemonList max=150 on:change={e => navigateTo(`/${e.detail.id}`)} />
  <Route path="/:id" let:router>
    <In modal on:cancel={() => navigateTo('/')}>
      <PokemonView id={router.params.id} />
    </In>
  </Route>
</Router>
