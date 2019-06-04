<script>
  import { state, key } from '../client';
  import Failure from './Failure.svelte';
  import Status from './Status.svelte';

  export let from = null;
  export let label = 'An error has ocurred';
  export let pending = 'Loading...';
  export let nostatus = false;
  export let otherwise = 'Done';

  $: promise = $state[key(from)];
</script>

{#if !nostatus}
  <slot name="status">
    <Status {label} {pending} {otherwise} from={promise} />
  </slot>
{/if}

{#if promise}
  {#await promise}
    <slot name="loading">
      <h3>{pending}</h3>
    </slot>
  {:then data}
    <slot {data} />
  {:catch error}
    <slot name="failure" {label} {error}>
      <Failure {label} {error} />
    </slot>
  {/await}
{/if}
