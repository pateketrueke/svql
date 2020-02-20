<script>
  export let label = null;
  export let error = null;
  export let format = null;
  export let nodebug = false;
  export let noformat = false;

  function formatError(e) {
    if (e.message.indexOf('Variable ') === 0) {
      const parts = e.message.split(/"(.+?)"(.+?)/);

      if (parts && parts[1].charAt() === '$') {
        return `Value for ${parts[1].substr(1)} ${parts.pop().replace('null', 'empty')}`;
      }
    }
    return e.message;
  }

  function fixedStack(e) {
    return (e.stack || e.toString()).replace(/.*Error:(.+?)$/m, '$1').trim();
  }

  function isError(e) {
    return Object.prototype.toString.call(e) === '[object Error]';
  }
</script>

<style>
  div {
    background-color: inherit;
    color: inherit;
  }
</style>

<div role="alert">
  {#if isError(error)}
    <h3>{label || error.description || error.message || error.toString()}</h3>
    {#if !nodebug && error.stack}<pre>{fixedStack(error)}</pre>{/if}
  {:else}
    <h3>{label || 'An error has ocurred.'}</h3>
    {#if Array.isArray(error)}<ul>
      {#each error as e}
        <li>
          {#if !nodebug}
            {#if e.description && e.message}
              <details>
                <summary>{e.message}</summary>
                <pre>{e.description}</pre>
                {#if e.stack}<pre>{fixedStack(e)}</pre>{/if}
              </details>
            {:else}
              <pre>{fixedStack(e)}</pre>
            {/if}
          {:else if !noformat}
            {typeof format === 'function' ? format(e) : formatError(e)}
          {/if}
        </li>
      {/each}
    </ul>{/if}
  {/if}
</div>
