<script>
  import Failure from './Failure.svelte';

  let cssClass = '';
  let fixedClass = '';
  let fixedStyle = '';

  export let from = null;
  export let label = 'An error has ocurred';
  export let pending = 'Loading...';
  export let otherwise = 'Done.';

  export let fixed = false;
  export let className = '';
  export { cssClass as class };

  // apply fixed-class and/or custom properly...
  $: fixedClass = [fixed ? 'fixed' : '', className].filter(x => x.length).join(' ');

  // build css-props based on fixed ones...
  $: fixedStyle = fixed && typeof fixed === 'object'
    ? Object.keys(fixed).reduce((p, k) => p.concat(`${k}:${fixed[k]}`), []).join(';')
    : '';
</script>

<style>
  .fixed {
    background-color: white;
    position: fixed;
    overflow: auto;
    padding: 10px;
    width: 100%;
    z-index: 1;
    bottom: 0;
    left: 0;
  }
</style>

{#if from}
  <div style={fixedStyle} class={fixedClass} role="status">
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
