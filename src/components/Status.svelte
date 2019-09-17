<script>
  import Failure from './Failure.svelte';

  let cssClass = '';
  let fixedClass = '';

  export let from = null;
  export let label = 'An error has ocurred';
  export let pending = 'Loading...';
  export let otherwise = 'Done.';

  export let fixed = false;
  export let className = '';
  export { cssClass as class };

  $: fixedClass = `${fixed ? 'fixed' : ''} ${className}`;
</script>

<style>
  .fixed {
    background-color: inherit;
    position: fixed;
    padding: 10px;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 1;
  }
</style>

{#if from}
  <div class={fixedClass}>
    {#await from}
      <slot name="pending">
        <h3>{pending}</h3>
      </slot>
    {:then result}
      <slot name="otherwise" {result}>
        <h3>{otherwise}</h3>
      </slot>
    {:catch error}
      <slot name="exception" {error}>
        <Failure {label} {error} />
      </slot>
    {/await}
  </div>
{/if}
