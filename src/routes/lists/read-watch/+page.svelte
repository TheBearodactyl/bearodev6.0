<script lang="ts">
    import { goto } from "$app/navigation";
    import BookCard from "$lib/components/cards/BookCard.svelte";
    import TagsBar from "$lib/components/inputs/TagsBar.svelte";
    import { API_BASE, type Book, type BookQuery } from "$lib/types";
    import { build_rw_search_params } from "$lib/utils/api";
    import { error } from "@sveltejs/kit";
    import { onMount } from "svelte";

    let items: Book[] = $state([]);
    let genres: string[] = $state([]);
    let tags: string[] = $state([]);

    async function search_books() {
        try {
            const query: BookQuery = {
                genres: genres,
                tags: tags,
            };

            const response = await fetch(
                `${API_BASE}/read-watch/search?${build_rw_search_params(query)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                error(500, `${response.statusText}`);
            }

            console.log(response.text);
            return await response.json();
        } catch (err) {
            console.log(err);
        }
    }

    onMount(async () => {
        items = await search_books();
    });
</script>

<TagsBar
    {tags}
    on_click_tag={async (tag: string) => {
        tags = tags.filter((t) => t !== tag);
        items = await search_books();
    }}
/>

<div class="read-watch-container">
    {#each items as book}
        <BookCard
            on_select_genre={async (genre: string) => {
                genres.push(genre);
                items = await search_books();
            }}
            on_select_tag={async (tag: string) => {
                tags.push(tag);
                items = await search_books();
            }}
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
