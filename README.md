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
