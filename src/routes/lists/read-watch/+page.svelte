<script lang="ts">
    import { goto } from "$app/navigation";
    import BookCard from "$lib/components/cards/BookCard.svelte";
    import { API_BASE, type Book } from "$lib/types";
    import { error } from "@sveltejs/kit";
    import { onMount } from "svelte";

    let items: Book[] = $state([]);

    onMount(async () => {
        try {
            const response = await fetch(`${API_BASE}/read-watch/search`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                error(500, `${response.statusText}`);
            }

            console.log(response.text);
            items = await response.json();
        } catch (err) {
            console.log(err);
        }
    });
</script>

<div class="read-watch-container">
    {#each items as book}
        <BookCard
            on_click={() => {
                goto(`/lists/read-watch/${book._id.$oid}`);
            }}
            {book}
        ></BookCard>
    {/each}
</div>

<style>
    .read-watch-container {
        column-count: 5;
        column-gap: 3rem;
        width: 100%;
        padding: 2rem;
        position: relative;
    }
</style>
