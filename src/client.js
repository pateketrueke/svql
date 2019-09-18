import { writable, get } from 'svelte/store';
import FetchQL from 'fetchql';

export const conn$ = writable({});
export const state$ = writable({});

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
    hash = ((hash << 5) - hash) + chr; // eslint-disable-line
    hash |= 0; // eslint-disable-line
    i += 1;
  }

  return hash;
}

export function key(c, gql) {
  // group-by generic identifier per-client connection!
  c._id = c._id || Math.random().toString(36).substr(2);

  const matches = gql.match(RE_QUERY_NAME);

  if (matches) {
    if (!seen.includes(gql)) {
      seen.push(gql);
    }

    const offset = seen.indexOf(gql);

    if (!keys[offset]) {
      keys[offset] = matches[3] || hashCode(gql.replace(/\W/g, ''));
    }

    return `${c._id}.${keys[offset]}`;
  }

  return `${c._id}.${gql}`;
}

export function read(c, gql) {
  return get(state$)[key(c, gql)];
}

export function resp(c, gql, result, callback) {
  return Promise.resolve()
    .then(() => typeof callback === 'function' && callback(result.data))
    .then(retval => {
      if (!retval && result.data) {
        state$.update(old => Object.assign(old, { [key(c, gql)]: result.data }));
      }

      return retval || result.data;
    });
}

export function query(c, gql, data, callback) {
  if (typeof data === 'function') {
    callback = data;
    data = undefined;
  }

  return Promise.resolve()
    .then(() => {
      const promise = c
        .query({ query: gql, variables: data })
        .then(result => resp(c, gql, result, callback));

      state$.update(old => Object.assign(old, { [key(c, gql)]: promise }));

      // ensure this value passes isFailure() tests!
      return promise.catch(() => IS_FAILURE);
    });
}

export function mutation(c, gql, cb = done => done()) {
  return function call$(...args) { cb((data, callback) => query(c, gql, data, callback)).apply(this, args); };
}

let _client;

export class GraphQLClient {
  constructor(url, options) {
    if (typeof url === 'object') {
      options = url;
      url = options.url;
    }

    if (!(url && typeof url === 'string')) {
      throw new Error(`Invalid url, given '${options.url}'`);
    }

    this.client = new FetchQL({
      url,
      onStart(x) { conn$.set({ loading: x > 0 }); },
      onEnd(x) { conn$.set({ loading: x > 0 }); },
      interceptors: [{
        response(_resp) {
          if (_resp.status !== 200) {
            return _resp.json().then(result => {
              if (!result.errors) {
                throw new Error(`Unexpected response, given '${_resp.status}'`);
              }

              throw result.errors;
            });
          }

          return _resp;
        },
      }],
      ...options,
    });

    // overload methods/accesors
    this.key = (...args) => key(this.client, ...args);
    this.read = (...args) => read(this.client, ...args);
    this.query = (...args) => query(this.client, ...args);
    this.mutation = (...args) => mutation(this.client, ...args);
  }

  static setClient(client) {
    _client = client;
  }
}

// singleton methods/accessors
function call(fn, name) {
  return (...args) => {
    if (!(_client && _client.client)) {
      throw new Error(`setupClient() must be called before ${name}()!`);
    }

    return fn(_client.client, ...args);
  };
}

export const key$ = call(key);
export const read$ = call(read);
export const query$ = call(query);
export const mutation$ = call(mutation);
