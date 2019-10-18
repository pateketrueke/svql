<script>
  import { isFailure, state$, key$ } from '../client';
  import Failure from './Failure.svelte';
  import Status from './Status.svelte';

  export let from = null;
  export let label = 'An error has ocurred';
  export let pending = 'Please wait...';
  export let otherwise = 'Done';
  export let loading = 'Loading...';
  export let nostatus = false;
  export let nodebug = false;

  $: promise = typeof from === 'string' ? $state$[key$(from)] : from;
</script>

{#if !nostatus}
  <slot name="status" {label} {pending} {otherwise} from={promise}>
    <Status {label} {pending} {otherwise} {nodebug} from={promise} />
  </slot>
{/if}

{#if promise}
  {#await promise}
    <slot name="loading">
      <h3>{loading}</h3>
    </slot>
  {:then data}
    {#if isFailure(data)}
      <slot name="failure" error={data}>
        <Failure {nodebug} {label} error={data} />
      </slot>
    {:else}
      <slot {data} />
    {/if}
  {:catch error}
    <slot name="failure" {error}>
      <Failure {nodebug} {label} {error} />
    </slot>
  {/await}
{/if}
