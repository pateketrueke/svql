<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { conn$ } from '../client';

  let ref = null;
  let cssClass = '';
  let fixedClass = '';

  export let id = '';
  export let modal = false;
  export let autofocus = false;
  export let className = '';
  export { cssClass as class };

  $: fixedClass = modal ? 'overlay' : 'inline';

  const dispatch = createEventDispatcher();

  function handleSubmit(e) {
    if (e.target.checkValidity()) {
      dispatch('submit', e);
    }
  }

  function checkEscape(e) {
    if (modal && e.keyCode === 27) {
      dispatch('cancel', e);
    }
  }

  function closeMe(e) {
    if (modal && ref === e.target) {
      dispatch('cancel', e);
    }
  }

  onMount(() => {
    if (ref && autofocus) {
      setTimeout(() => {
        const nodes = ref.querySelectorAll('input,button,textarea');

        for (let i = 0; i < nodes.length; i += 1) {
          if (nodes[i].tagName === 'INPUT' && nodes[i].type === 'hidden') continue;
          if (nodes[i].readOnly || nodes[i].disabled) continue;
          nodes[i].focus();
          break;
        }
      }, 60);
    }
  });
</script>

<style>
  .overlay {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, .3);
  }

  .wrapper {
    background-color: white;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .2);
  }

  .loading {
    opacity: .3;
    pointer-events: none;
  }

  .inline {
    display: inline-block;
  }

  form {
    padding: 10px;
  }
</style>

<svelte:window on:keyup={checkEscape} />

<div class={fixedClass} on:click={closeMe} bind:this={ref} role="dialog">
  <div class="wrapper">
    <slot name="before" />
    <form {id} class="{className || cssClass}" on:submit|preventDefault={handleSubmit} class:loading={$conn$.loading}>
      <slot />
    </form>
    <slot name="after" />
  </div>
</div>
