> The _easiest_ way to consume GraphQL APIs in Svelte3
>
> ![Build status](https://github.com/pateketrueke/svql/workflows/build/badge.svg)
> [![NPM version](https://badge.fury.io/js/svql.svg)](http://badge.fury.io/js/svql)
> [![Known Vulnerabilities](https://snyk.io/test/npm/svql/badge.svg)](https://snyk.io/test/npm/svql)

```html
<script>
  import { Out, query, setupClient } from 'svql';

  setupClient({
    url: 'https://graphql-pokemon2.vercel.app/',
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
  <h3>{data.pokemon.number}. {data.pokemon.name}</h3>
  <img alt={data.pokemon.name} src={data.pokemon.image} />
</Out>
```

## How it works.

`svql` uses a [fetchql]() singleton to talk to GraphQL. You can configure it through the `setupClient()` method.

Both `query` and `mutation` helpers will take the GQL and return a promise (or function that returns a promise, respectively).

### `query(gql[, data[, callback]]): Promise`

> Queries are indexed so you can refer to them as `from={MY_GQL_QUERY}`. `data` is optional, as is the `callback` function. Any truthy value returned by this callback will be used in-place of the regular response.

Accessing those values can be done through `<Out />` components as shown above, or by watching the returned promises:

```html
<script>
  // ...imports
  let promise = query(GET_POKEMON_INFO, { name: 'Bulbasaur' });
</script>
<!-- we can use {#await promise}...{/await} -->
```

Refetching of queries can be done through reactive statements:

```html
<script>
  // ...imports
  export let name = '';
  $: query(GET_POKEMON_INFO, { name });
</script>
```

Each time `name` changes, the query re-executes.

### `mutation(gql[, callback]): Function`

> The callback will receive a `commit` function that accepts variables-input as first argument, and optionally a second function to handle the response. Values returned by this function are also promises.

Mutations are functions that could result in more work, so you need to be sure and `commit` once you're ready for the actual request:

```html
<script>
  // ...imports
  export let email = '';
  let password;
  let promise;
  const doLogin = mutation(LOGIN_REQUEST, commit => function login() {
    promise = commit({ email, password }, data => {
      saveSession(data.login);
      location.href = '/';
    });
  });
</script>
<p>Email: <input type="email" bind:value={email} /></p>
<p>Password: <input type="password" bind:value={password} /></p>
<button on:click={doLogin}>Log in</button>
```

Since `mutation()` returns a function, there's no need to setup reactive statements to _refetch_ it. Just calling the generated function is enough.

## Components

You can access `svql` stores as `conn` and `state` respectively.  However, it is better to use the following components to handle state. :sunglasses:

### `<Failure ... />`

No longer shipped, use a separate `Failure` component from [smoo](https://github.com/pateketrueke/smoo).

### `<Status {from} {label} {pending} {otherwise} />`

This takes a `from={promise}` value, then renders its progress, catches the failure, etc.

Available props:

- `{from}` &mdash; Promise-like value to handle status changes
- `{label}` &mdash; Label used for `{:catch error}` handling with `<Failure />`
- `{fixed}` &mdash; Setup `<Status />` container as fixed, positioned at `left:0;bottom:0` by default
- `{pending}` &mdash; Message while the promise is being resolved...
- `{otherwise}` &mdash; Message while once promise has resolved successfully

> With `fixed` you can provide offsets, e.g. `<Status fixed="{{ top: '10vh' }}" />`

Available slots:

- `pending` &mdash; Replace the `{:await}` block, default is an `<h3 />`
- `otherwise` &mdash; Replace the `{:then}` block, default is an `<h3 />`; it receives `let:result`
- `exception` &mdash; Replace the  `{:catch}` block, default is `<Failure />`; it receives `let:error`

### `<Out {nostatus} {loading} {...} let:data />`

Use this component to access data `from={promise}` inside, or `from={GQL}` to extract it from resolved state.

Available props:

- `{nostatus}` &mdash; Boolean; its presence disables the `<Status />` render
- `{loading}` &mdash; Message while the promise is being resolved...
- `{...}` &mdash; Same props from `<Status />`
- `let:data` &mdash; Unbound `data` inside

Available slots:

- `status` &mdash; Replaces the `<Status />` render with custom markup; it receives the same props as `<Status />`
- `loading` &mdash; Replace the `{:then}` block, default is an `<h3 />`; it receives `let:result`
- `failure` &mdash; Replace the `{:catch}` block, default is `<Failure />`; it receives `let:error`

### `<In ... />`

No longer shipped, use a separate `Fence` component from [smoo](https://github.com/pateketrueke/smoo).

> Loading states should be bound as `<Fence loading={$conn.loading}>...</Fence>` to properly block the UI.

## Public API

- `setupClient(options[, key])` &mdash; Configure a `FetchQL` singleton with the given `options`, `key` is used for session loading
- `useClient(options[, key])` &mdash; Returns a `FetchQL` instance with the given `options`, `key` is used for session loading
- `useToken(value[, key])` &mdash; Update the session-token used for Bearer authentication, `key` is used for session loading
- `saveSession(data[, key])` &mdash; Serializes any given value as the current session, it MUST be a plain object or null
- `read(gql|key)` &mdash; Retrieve current value from `state` by key, a shorthand for `$state[key]` values
- `key(gql)` &mdash; Returns a valid `key` from GQL-strings, otherwise the same value is returned
- `$state` &mdash; Store with all resolved state by the `fetchql` singleton
- `$conn` &mdash; Store with connection details during `fetchql` requests

> `sqvl` use **Bearer authentication** by default, so any token found in the session will be sent forth-and-back.

If you want to change your client's authorization token, you may call `client.setToken()` &mdash; or `useToken()` globally.
