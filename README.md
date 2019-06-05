> The _easiest_ way to consume GraphQL APIs
>
> [![Build Status](https://api.travis-ci.org/pateketrueke/svql.svg?branch=master)](https://travis-ci.org/pateketrueke/svql)
> [![NPM version](https://badge.fury.io/js/svql.svg)](http://badge.fury.io/js/svql)
> [![Known Vulnerabilities](https://snyk.io/test/npm/svql/badge.svg)](https://snyk.io/test/npm/svql)

```html
<script>
  import { Out, query, setupClient } from 'svql';

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
  <h3>{data.pokemon.number}. {data.pokemon.name}</h3>
  <img alt={data.pokemon.name} src={data.pokemon.image} />
</Out>
```

## How it works?

`svql` use a [fetchql]() singleton to talk with GraphQL, configure it through the `setupClient()` method.

Both `query` and `mutation` helpers will take the GQL and returns a promise or function that returns a promise, respectively.

### `query(gql[, data[, callback]]): Promise`

> Queries are indexed so you can refer to them as `from={MY_GQL_QUERY}` and such, `data` is optional the same as `callback` function. Any truthy value returned by this callback will be used in-place of the regular response.

Accessing those values can be done through `<Out />` components as above, or by watching the returned promises, e.g.

```html
<script>
  // ...imports
  let promise = query(GET_POKEMON_INFO, { name: 'Bulbasaur' });
</script>
<!-- we can use {#await promise}...{/await} -->
```

Refetching of queries can be done through reactive statements, e.g.

```html
<script>
  // ...imports
  export let name = '';
  $: query(GET_POKEMON_INFO, { name });
</script>
```

So each time `name` changes the query is executed again.

### `mutation(gql[, callback]): Function`

> The callback will receive a `commit` function that accepts variables-input as first argument, and optionally a second function to handle the response. Values returned by this function are also promises.

Mutations are functions that could make more work, so you need to be sure and `commit` once you're ready for the actual request, e.g.

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

Since `mutation()` returns a function there's no need to setup reactive statements to _refetch_ it, just calling the generated function is enough.

## Components

You can access `svql` stores as `conn` and `state` respectively, however is better to use the following components to deal with. :sunglasses:

### `<Failure {label} {error} />`

This component is used to format captured errors from `{:catch}` blocks.

Available props:

- `{label}` &mdash; Title used for the failure message
- `{error}` &mdash; Error object or array of errors to display

### `<Status {from} {label} {pending} {otherwise} />`

It takes a `from={promise}` value and then render its progress, catch the failure, etc.

Available props:

- `{from}` &mdash; Promise-like value to handle status changes
- `{label}` &mdash; Label used for `{:catch error}` handling with `<Failure />`
- `{pending}` &mdash; Message while the promise is being resolved...
- `{otherwise}` &mdash; Message while once promise has resolved successfully

Available slots:

- `pending` &mdash; Replace the `{:await}` block, default is an `<h3 />`
- `otherwise` &mdash; Replace the `{:then}` block, default is an `<h3 />`; it receives `let:result`
- `exception` &mdash; Replace the  `{:catch}` block, default is `<Failure />`; it receives `let:error`

### `<Out {nostatus} {loading} {...} let:data />`

Use this component to access data `from={promise}` inside, or `from={GQL}` to extract it from resolved state.

Available props:

- `{nostatus}` &mdash; Its presence disables the `<Status />` render
- `{loading}` &mdash; Message while the promise is being resolved...
- `{...}` &mdash; Same props from `<Status />`
- `let:data` &mdash; Unbound `data` inside

Available slots:

- `status` &mdash; Replaces the `<Status />` render with custom markup; it receives the same props as `<Status />`
- `loading` &mdash; Replace the `{:then}` block, default is an `<h3 />`; it receives `let:result`
- `failure` &mdash; Replace the `{:catch}` block, default is `<Failure />`; it receives `let:error`

### `<In {id} {class|className} {modal} {autofocus} />`

It is a `<form />` wrapper that handle various effects:

- Subscribes to the GraphQL connection status and block its content while loading...
- When rendered as a modal-overlay it can be canceled with the `ESC` key or clicking outside
- It can setup `autofocus` on the first input-element found inside the inner `<form />` wrapper (js only)

Available props:

- `{id}` &mdash; Used `id` for the inner `<form />` element
- `{class|className}` &mdash; Used `class` for the inner `<form />` element
- `{modal}` &mdash; Its presence will render the inner `<form />` in a modal-overlay
- `{autofocus}` &mdasg; Its presence enables `focus()` on the first input-element found

## Public API

- `setupClient(options[, key])` &mdash; Configure a `FetchQL` singleton with the given `options`, `key` is used for session loading
- `useClient(options[, key])` &mdash; Returns a `FetchQL` instance with the given `options`, `key` is used for session loading
- `saveSession(data[, key])` &mdash; Serializes any given value as the current session, it MUST be a plain object or null
- `read(gql|key)` &mdash; Retrieve current value from `state` by key, a shorthand for `$state[key]` values
- `key(gql)` &mdash; Returns a valid `key` from GQL-strings, otherwise the same value is returned
- `$state` &mdash; Store with all resolved state by the `fetchql` singleton
- `$conn` &mdash; Store with connection details during `fetchql` requests
