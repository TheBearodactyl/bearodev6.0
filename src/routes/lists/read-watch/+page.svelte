<script lang="ts">
    import { goto } from "$app/navigation";
    import BookCard from "$lib/components/cards/BookCard.svelte";
    import GenresBar from "$lib/components/inputs/GenresBar.svelte";
    import TagsBar from "$lib/components/inputs/TagsBar.svelte";
    import { API_BASE, type Book, type BookQuery } from "$lib/types";
    import { build_rw_search_params } from "$lib/utils/api";
    import { error } from "@sveltejs/kit";
    import { onMount } from "svelte";

    let items: Book[] = $state([]);
    let genres: string[] = $state([]);
    let tags: string[] = $state([]);
    let title: string = $state("");

    async function search_books() {
        try {
            const query: BookQuery = {
                genres: genres,
                tags: tags,
                title: title,
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

<h1 class="page-header">Read/Watch List</h1>

<button onclick={() => goto("/lists/read-watch/new")}>Add New Item</button>

<input
    bind:value={title}
    onchange={async () => {
        items = await search_books();
    }}
    placeholder="Search title"
    type="text"
/>

<div class="filter-bars">
    <TagsBar
        {tags}
        on_click_tag={async (tag: string) => {
            tags = tags.filter((t) => t !== tag);
            items = await search_books();
        }}
    />
    <GenresBar
        {genres}
        on_click_genre={async (genre: string) => {
            genres = genres.filter((g) => g !== genre);
            items = await search_books();
        }}
    />
</div>

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

<style lang="scss">
    .read-watch-container {
        column-count: 3;
        column-gap: 1rem;
        width: 100%;
        padding: 2rem;
        position: relative;

        @media (max-width: 798px) {
            column-count: 2;
        }

        @media (max-width: 412px), (max-width: 312px) {
            column-count: 1;
        }
    }

    
</style>
