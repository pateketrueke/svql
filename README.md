> The easiest way to consume GraphQL APIs
>
> [![Build Status](https://api.travis-ci.org/pateketrueke/svql.svg?branch=master)](https://travis-ci.org/pateketrueke/svql)
> [![NPM version](https://badge.fury.io/js/svql.svg)](http://badge.fury.io/js/svql)
> [![Coverage Status](https://codecov.io/github/pateketrueke/svql/coverage.svg?branch=master)](https://codecov.io/github/pateketrueke/svql)
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

> Queries are indexed so you can refer to them as `from={MY_GQL_QUERY}` and such, `data` is optional the same as `callback` function.

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

So each time `name` changes the same query is executed again.

### `mutation(gql, callback): Function`

> The callback will receive a `commit` function that demands variables-input as first argument, and optionally a second callback to handle the response. Values returned by this function are also promises.

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

Normally you don't access those responses on your markup, but of course you can do it the same way as queries.

Since `mutation()` returns a function there's no need to setup reactive statements to _refetch_ this, just calling the generated function is enough.

## Components

### `<Failure />`

### `<Status />`

### `<Out />`

### `<In />`

## Utilities

- `saveSession(data[, key])`
- `setupClient(options)`
- `key(gql)`
- `$state`
- `$conn`
