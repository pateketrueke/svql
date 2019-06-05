import { writable, get } from 'svelte/store';
import FetchQL from 'fetchql';

export const conn = writable({});
export const state = writable({});

const RE_QUERY_NAME = /(^|\b)(query|mutation)\s*([^{( )}]+)?/i;
const IS_FAILURE = Symbol('@@FAILURE');

const seen = [];
const keys = [];

export function isFailure(value) {
  return value === IS_FAILURE;
}

// https://stackoverflow.com/a/7616484
export function hashCode(value) {
  let hash = 0;
  let chr;

  if (value.length === 0) return hash;

  for (let i = 0; i < value.length;) {
    chr = value.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // eslint-disable-line
    i += 1;
  }

  return hash;
}

export function read(gql) {
  return get(state)[key(gql)];
}

export function key(gql) {
  const matches = gql.match(RE_QUERY_NAME);

  if (matches) {
    if (!seen.includes(gql)) {
      seen.push(gql);
    }

    const offset = seen.indexOf(gql);

    if (!keys[offset]) {
      keys[offset] = matches[3] || hashCode(gql.replace(/\W/g, ''));
    }

    return keys[offset];
  }

  return gql;
}

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
      return Promise.resolve()
        .then(() => typeof callback === 'function' && callback(result.data))
        .then(retval => {
          if (!retval && result.data) {
            state.update(old => Object.assign(old, { [key(gql)]: result.data }));
          }

          return retval || result.data;
        });
    }

    function query(gql, data, callback) {
      if (typeof data === 'function') {
        callback = data;
        data = undefined;
      }

      return Promise.resolve()
        .then(() => {
          const promise = client
            .query({ query: gql, variables: data })
            .then(result => resp(gql, result, callback));

          state.update(old => Object.assign(old, { [key(gql)]: promise }));

          // ensure this value passes isFailure() tests!
          return promise.catch(() => IS_FAILURE);
        });
    }

    function mutation(gql, cb = done => done()) {
      return function call$(...args) { cb((data, callback) => query(gql, data, callback)).apply(this, args); };
    }

    return {
      query,
      mutation,
    };
  }
}
