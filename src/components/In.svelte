<script context="module">
  const STACK = [];

  let t;

  function push(el, close, current) {
    STACK.push({ el, close, current });
  }

  function pop(e) {
    if (!STACK.length) return;

    const { el, close, current } = STACK[STACK.length - 1];

    setTimeout(() => current.focus(), 60);

    if (e instanceof KeyboardEvent) {
      close({ target: el });
      return;
    }

    clearTimeout(t);
    t = setTimeout(() => STACK.pop(), 120);
  }

  window.addEventListener('keyup', e => {
    if (e.keyCode === 27) pop(e);
  });
</script>

<script>
  import { createEventDispatcher } from 'svelte';
  import { conn$ } from '../client';

  let ref = null;
  let cssClass = '';
  let fixedClass = '';

  export let id = '';
  export let modal = false;
  export let visible = null;
  export let autofocus = false;
  export { cssClass as class };

  const dispatch = createEventDispatcher();

  function handleSubmit(e) {
    if (e.target.checkValidity()) {
      dispatch('submit', e);
      pop(e);
    }
  }

  function closeMe(e) {
    if (modal && ref === e.target) {
      dispatch('cancel', e);
      pop(e);
    }
  }

  $: if (ref) {
    if (visible === false) pop();
    if (visible) {
      push(ref, closeMe, document.activeElement);

      if (autofocus) setTimeout(() => {
        const nodes = ref.querySelectorAll('input,button,textarea');

        for (let i = 0; i < nodes.length; i += 1) {
          if (nodes[i].getAttribute('nofocus') === '' || nodes[i].dataset.nofocus === '') continue;
          if (nodes[i].tagName === 'INPUT' && nodes[i].type === 'hidden') continue;
          if (nodes[i].readOnly || nodes[i].disabled) continue;
          nodes[i].focus();
          break;
        }
      }, 60);
    }
  }

  $: fixedClass = modal ? 'overlay' : 'inline';
  $: fixedProps = { ...(id ? { id } : null), class: cssClass };
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

{#if visible}
  <div class={fixedClass} on:click={closeMe} bind:this={ref} role="dialog">
    <div class="wrapper">
      <slot name="before" />
      <form {...fixedProps} on:submit|preventDefault={handleSubmit} class:loading={$conn$.loading}>
        <slot />
      </form>
      <slot name="after" />
    </div>
  </div>
{/if}
