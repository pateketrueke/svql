<script>
  import {
    Router, Route, Link, router,
  } from 'yrv';

  import { In, Status } from '../src/main';
  import { Pokemon } from './pages/pokemon';

  let promise;
  let checked;
  let value;
  let show;

  function toggle() {
    show = !show;
  }

  function load() {
    promise = new Promise((ok, err) => {
      setTimeout(() => {
        if (checked) err(new Error('-1'));
        else ok(42);
      }, value || 1000);
    });
  }
</script>

<style>
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
  }

  body {
    margin: 0;
  }
</style>

{$router.path}

<Router>
  <Route exact path="/">
    <h1>It works!</h1>
    <Link href="/tests">Go to test-page</Link>
  </Route>
  <Route path="/:name" component={Pokemon} />
  <Route path="/tests">
    <button on:click={toggle}>Open modal</button>
    {#if show}
      <In modal autofocus on:cancel={toggle} on:submit={toggle}>
        <input type="text" />
        <button type="submit">close</button>
      </In>
    {/if}
    <hr />
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
