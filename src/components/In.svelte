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
    if (autofocus) {
      const nodes = ref.querySelectorAll('input,button,textarea');

      let node;

      for (let i = 0; i < nodes.length; i += 1) {
        if (nodes[i].tagName === 'INPUT' && nodes[i].type !== 'hidden') {
          nodes[i].focus();
          break;
        }

        node = nodes[i];
      }

      if (node) {
        setTimeout(() => node.focus(), 0);
      }
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

  .overlay > form {
    padding: 10px;
    background-color: white;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .2);
  }

  .inline {
    display: inline-block;
  }
</style>

<svelte:window on:keyup={checkEscape} />

<div class={fixedClass} on:click={closeMe} bind:this={ref}>
  <form {id} class="{className || cssClass}" on:submit|preventDefault class:loading={$conn$.loading}>
    <slot />
  </form>
</div>
