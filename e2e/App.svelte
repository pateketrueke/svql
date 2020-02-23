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
  let sub;

  function toggle() {
    show = !show;
  }

  function open() {
    sub = !sub;
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
    <Link href="/tests">Go to test-page</Link>
  </Route>
  <Route path="/:name" component={Pokemon} />
  <Route path="/tests">
    <button on:click={toggle}>Open modal</button>
    <In modal autofocus bind:visible={show} on:cancel={toggle} on:submit={toggle}>
      <input type="hidden" />
      <p><input type="number" readonly /></p>
      <p><textarea disabled>OK</textarea></p>
      <p><input type="text" /></p>
      <p>
        <button type="button" on:click={open}>nested</button>
        <button type="submit">close</button>
      </p>
      <div slot="after">
        <In modal autofocus bind:visible={sub} on:cancel={open} on:submit={open}>
          <button nofocus type="button" on:click={open}>x</button>
          <input type="number" />
          Sub modal
        </In>
      </div>
    </In>
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
