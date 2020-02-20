<script>
  import Failure from './Failure.svelte';

  let status = -1;
  let fixedClass = '';
  let fixedStyle = '';

  const cssClass = '';

  export let from = null;
  export let label = 'An error has ocurred';
  export let pending = 'Loading...';
  export let otherwise = 'Done.';
  export let nodebug = false;

  export let fixed = false;
  export let className = '';
  export { cssClass as class };

  function wrap(promise) {
    return new Promise((resolve, reject) => {
      status = -1;
      promise.then(resolve)
        .then(result => {
          status = 1;
          resolve(result);
        })
        .catch(e => {
          status = 0;
          reject(e);
        });
    });
  }

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
  .pending {
    background-color: #F7FAFC;
    color: #6F79E6;
  }
  .success {
    background-color: #CBF4C9;
    color: #186A4C;
  }
  .failed {
    background-color: #F6E6B9;
    color: #AC5C2B;
  }
  div {
    padding: 10px;
  }
</style>

{#if from}
  <div
    role="status"
    style={fixedStyle}
    class={className}
    class:fixed
    class:failed={status === 0}
    class:success={status === 1}
    class:pending={status === -1}
  >
    {#await wrap(from)}
      <slot name="pending">
        <h3>{pending}</h3>
      </slot>
    {:then result}
      <slot name="otherwise" {result}>
        <h3>{otherwise}</h3>
      </slot>
    {:catch error}
      <slot name="exception" {error}>
        <Failure {nodebug} {label} {error} />
      </slot>
    {/await}
  </div>
{/if}
