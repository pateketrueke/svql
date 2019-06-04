import { GraphQLClient, state as _state, conn as _conn, key as _key, read as _read } from './client';

export { default as Status } from './components/Status.svelte';
export { default as Failure } from './components/Failure.svelte';
export { default as In } from './components/In.svelte';
export { default as Out } from './components/Out.svelte';

function undef() {
  throw new Error('setupClient() must be called before!');
}

// shared stores
export const state = _state;
export const conn = _conn;

// accessors
export const read = _read;
export const key = _key;

// methods
export let query = undef;
export let mutation = undef;

export function saveSession(values, sessionKey) {
  localStorage.setItem(sessionKey || 'session', JSON.stringify(values || {}));
}

export function setupClient(options, sessionKey) {
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

  const client = new GraphQLClient({
    ..._options,
    headers: _headers,
  });

  query = client.query;
  mutation = client.mutation;
}
