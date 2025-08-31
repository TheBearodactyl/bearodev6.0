<script lang="ts">
  import type { HomePageItem, RouteItemNext } from "$lib/types";
  import NavigationCard from "../cards/NavigationCard.svelte";

  interface Props {
    cards: RouteItemNext[];
  }

  let { cards }: Props = $props();
</script>

<div class="home-page-gallery">
  {#each cards as card_data}
    <NavigationCard card={card_data}></NavigationCard>
  {/each}
</div>
