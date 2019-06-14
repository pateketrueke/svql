import {
  GraphQLClient, state$, conn$, query$, mutation$, key$, read$,
} from './client';

export { default as Status } from './components/Status.svelte';
export { default as Failure } from './components/Failure.svelte';
export { default as In } from './components/In.svelte';
export { default as Out } from './components/Out.svelte';

// shared stores
export const state = state$;
export const conn = conn$;

// accessors/methods
export const key = key$;
export const read = read$;
export const query = query$;
export const mutation = mutation$;

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
  GraphQLClient.setClient(useClient(options, sessionKey));
}
