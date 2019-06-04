import { writable } from 'svelte/store';
import FetchQL from 'fetchql';

const seen = [];
const keys = [];

export function key(gql) {
  if (!seen.includes(gql)) {
    seen.push(gql);
  }

  const offset = seen.indexOf(gql);

  if (!keys[offset]) {
    keys[offset] = gql.toString().replace(/\W+/g, '_');
  }

  return keys[offset];
}

export const conn = writable({});
export const state = writable({});

export class GraphQLClient {
  constructor(url, options) {
    if (typeof url === 'object') {
      options = url;
      url = options.url;
    }

    if (!(url && typeof url === 'string')) {
      throw new Error(`Invalid url, given '${options.url}'`);
    }

    const client = new FetchQL({
      url,
      onStart(x) { conn.set({ loading: x > 0 }); },
      onEnd(x) { conn.set({ loading: x > 0 }); },
      interceptors: [{
        response(resp) {
          if (resp.status !== 200) {
            return resp.json().then(result => {
              if (!result.errors) {
                throw new Error(`Unexpected response, given '${resp.status}'`);
              }

              throw result.errors;
            });
          }

          return resp;
        },
      }],
      ...options,
    });

    function resp(gql, result, callback) {
      const retval = typeof callback === 'function' && callback(result.data);

      if (!retval && result.data) {
        state.update(old => Object.assign(old, { [key(gql)]: result.data }));
      }

      return retval;
    }

    function query(gql, data, callback) {
      if (typeof data === 'function') {
        callback = data;
        data = undefined;
      }

      const promise = client
        .query({ query: gql, variables: data })
        .then(result => resp(gql, result, callback));

      state.update(old => Object.assign(old, { [key(gql)]: promise }));

      return promise;
    }

    function mutation(gql, cb = done => done()) {
      return function call$(...args) { cb((data, callback) => query(gql, data, callback)).apply(this, args); };
    }

    return {
      key,
      query,
      mutation,
    };
  }
}
