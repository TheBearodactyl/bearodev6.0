<script lang="ts">
  import { goto } from "$app/navigation";
  import HomeGallery from "$lib/components/galleries/HomeGallery.svelte";
  import type { HomePageItem, RouteItemNext } from "$lib/types";
  import { m } from "$lib/paraglide/messages";

  let cards: RouteItemNext[] = [
    {
      cover_image: "/images/brocollie.png",
      path: "/lists/read-watch",
      key: "read-watch",
      title: "Read/Watch List",
      description: "stuff i've read/watched"
    },
  ];
</script>

<div class="routes-list">
  <button
    onclick={() => {
      goto("/lists/read-watch");
    }}
  >
    {m["titles_routes_read-watch"]()}
  </button>
  <button
    onclick={() => {
      goto("/login");
    }}
  >
    Login
  </button>
</div>

<HomeGallery {cards} />
