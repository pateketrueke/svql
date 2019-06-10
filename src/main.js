import {
  GraphQLClient, query as _query, mutation as _mutation, state as _state, conn as _conn, key as _key, read as _read,
} from './client';

export { default as Status } from './components/Status.svelte';
export { default as Failure } from './components/Failure.svelte';
export { default as In } from './components/In.svelte';
export { default as Out } from './components/Out.svelte';

let _client;

// singleton methods/accessors
function call(fn, name) {
  return (...args) => {
    if (!_client) {
      throw new Error(`setupClient() must be called before ${name}()!`);
    }

    return fn(_client.client, ...args);
  };
}

// shared stores
export const state = _state;
export const conn = _conn;

// accessors/methods
export const key = call(_key, 'key');
export const read = call(_read, 'read');
export const query = call(_query, 'query');
export const mutation = call(_mutation, 'mutation');

export function saveSession(values, sessionKey) {
  localStorage.setItem(sessionKey || 'session', JSON.stringify(values || {}));
}

export function useClient(options, sessionKey) {
  let _session;

  try {
    _session = JSON.parse(localStorage.getItem(sessionKey || 'session')) || {};
  } catch (e) {
    _session = {};
  }

  const _options = options || {};
  const _headers = { ..._options.headers };

  if (_session.token) {
    _headers.Authorization = `Bearer ${_session.token}`;
  }

  return new GraphQLClient({
    ..._options,
    headers: _headers,
  });
}

export function setupClient(options, sessionKey) {
  _client = useClient(options, sessionKey);
}
