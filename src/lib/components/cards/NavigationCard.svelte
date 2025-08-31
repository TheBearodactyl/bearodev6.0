<script lang="ts">
  import type { HomePageItem, RouteItemNext } from "$lib/types";

  interface Props {
    card: RouteItemNext;
  }

  let { card }: Props = $props();

  const get_item_title = (item: RouteItemNext): string | undefined => {
    return item.title ?? (item.name ? `titles.routes.${item.name}` : item.name_key);
  };
</script>

<button
  class="nav-card {card.path ? 'clickable' : ''}"
  title={card.title ? card.title : "Navigation Item"}
  onclick={() => {}}
>
  <div class="card-image-container">
    {#if card.cover_image}
      {#if card.cover_image.endsWith("webm")}
        <video
          src={card.cover_image}
          class="card-image"
          autoplay
          loop
          muted
          playsinline
          disablepictureinpicture
        ></video>
        {:else}
        <img
          src={card.cover_image}
          alt={`Cover for ${card.title}`}
          class="card-image"
          loading="lazy"
        />
      {/if}
    {/if}
  </div>
</button>
