<script lang="ts">
  import { goto } from "$app/navigation";
  import HomeGallery from "$lib/components/galleries/HomeGallery.svelte";
  import type { HomePageItem } from "$lib/types";

  let cards: HomePageItem[] = [
    {
      image: "/images/brocollie.png",
      img_alt: "woah",
      info: {
        title: "woaaah",
        description: "this is a description",
      },
    },
    {
      image: "/images/buggy.webp",
      img_alt: "woah",
      info: {
        title: "woaaah",
        description: "this is a description",
      },
    },
    {
      image: "/images/hobo.avif",
      img_alt: "woah",
      info: {
        title: "woaaah",
        description: "this is a description",
      },
    },
    {
      image: "/images/idle.gif",
      img_alt: "woah",
      info: {
        title: "woaaah",
        description: "this is a description",
      },
    },
  ];
</script>

<div class="routes-list">
  <button
    onclick={() => {
      goto("/lists/read-watch");
    }}>Read/Watch List</button
  >
  <button
    onclick={() => {
      goto("/login");
    }}
  >
    Login
  </button>
</div>

<HomeGallery {cards} />
