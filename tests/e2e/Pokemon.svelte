 <script>
  export let info = null;
</script>

{#if info}
  <figure>
    <img width=150 src={info.image} alt={info.name} />
    <figcaption>
      <h2>{info.name}</h2>
    </figcaption>
  </figure>
{/if}
