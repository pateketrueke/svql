<script>
  import Failure from './Failure.svelte';
  import { state } from '../client';

  export let from = null;
  export let label = 'An error has ocurred';
  export let pending = 'Loading...';
  export let otherwise = 'Done.';
</script>

{#if from}
  {#await from}
    <slot name="pending">
      <h3>{pending}</h3>
    </slot>
  {:then}
    <slot name="otherwise">
      <h3>{otherwise}</h3>
    </slot>
  {:catch error}
    <slot name="exception">
      <Failure {label} {error} />
    </slot>
  {/await}
{/if}
