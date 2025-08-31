<script lang="ts">
  import type { RouteItemNext } from "$lib/types";

  interface Props {
    card: RouteItemNext;
  }

  let { card }: Props = $props();
</script>

<button
  class="nav-card {card.path ? 'clickable' : ''} home-page-card"
  title={card.title ? card.title : "Navigation Item"}
  onclick={() => {}}
>
  <div class="card-image-container">
    {#if card.cover_image}
      <img
        src={card.cover_image}
        alt={`Cover for ${card.title}`}
        class="card-image"
        loading="lazy"
      />
    {/if}
  </div>

  <div class="card-info">
    {#if card.title}
      <div class="title">{card.title}</div>
    {/if}

    {#if card.description}
      <div class="desc">{card.description}</div>
    {/if}
  </div>
</button>
