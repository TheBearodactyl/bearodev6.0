<script lang="ts">
  import type { HomePageItem } from "$lib/types";
  import NavigationCard from "../cards/NavigationCard.svelte";

  interface Props {
    cards: HomePageItem[];
  }

  let { cards }: Props = $props();
</script>

<div class="home-page-gallery">
  {#each cards as card_data}
    <NavigationCard card={card_data}></NavigationCard>
  {/each}
</div>
