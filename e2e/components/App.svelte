<script>
  import { Router, Route, Link } from 'yrv';
  import { Fence } from 'smoo';
  import { Status } from 'svql';
  import { Pokemon } from './pages/pokemon';

  let promise;
  let checked;
  let value;

  function load() {
    promise = new Promise((ok, err) => {
      setTimeout(() => {
        if (checked) err(new Error('-1'));
        else ok(42);
      }, value || 1000);
    });
  }

  let name;
  let visible;
  function toggle() {
    visible = !visible;
    name = null;
  }
</script>

<style>
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :global(html), :global(body) {
    height: 100%;
  }

  :global(body) {
    margin: 0;
  }

  input:active,
  input:focus,
  button:active,
  button:focus {
    outline: none;
    box-shadow: 0 0 3px rgba(0, 0, 0, .3);
  }
</style>

<Router>
  <Route exact path="/">
    <h1>It works!</h1>
    <Link href="/tests">Go to test-page</Link> or <button on:click={toggle}>open test</button>
    <Fence modal autofocus bind:visible on:cancel={toggle}>
      <select bind:value={name}>
        <option value="" disabled selected>Choose wisely!</option>
        <option>charmander</option>
        <option>bulbasaur</option>
        <option>squirtle</option>
      </select>
      {#if name}
        <Pokemon {name} />
      {/if}
      <button on:click={toggle}>close</button>
    </Fence>
  </Route>
  <Route path="/:name" component={Pokemon} />
  <Route path="/tests">
    <button on:click={load}>Load promise</button>
    <label>
      <input type="checkbox" bind:checked />
      Throw error?
    </label>
    <hr />
    <label>
      <input type="number" bind:value />
      Delay in ms.
    </label>
    <Status fixed from={promise} />
  </Route>
</Router>
