<script lang="ts">
  import { goto } from "$app/navigation";
  import { m } from "$lib/paraglide/messages";
  import type { RouteItemNext } from "$lib/types";
  import { get_route_info } from "$lib/utils/loc";
  import { onMount } from "svelte";

  interface Props {
    card: RouteItemNext;
  }

  let { card }: Props = $props();
  let name = $state("");
  let desc = $state("");

  onMount(() => {
    name = get_route_info(card.key).name;
    desc = get_route_info(card.key).desc;
  });
</script>

<button
  class="nav-card {card.path ? 'clickable' : ''} home-page-card"
  title={card.title ? card.title : "Navigation Item"}
  onclick={() => {
    goto(card.path);
  }}
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
      <div class="title">{name}</div>
    {/if}

    {#if card.description}
      <div class="desc">{desc}</div>
    {/if}
  </div>
</button>
