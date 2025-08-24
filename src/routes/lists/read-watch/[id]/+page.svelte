<script lang="ts">
    import { page } from "$app/state";
    import ExpandedBookCard from "$lib/components/cards/ExpandedBookCard.svelte";
    import { API_BASE, type Book } from "$lib/types";
    import { error } from "@sveltejs/kit";
    import { onMount } from "svelte";

    let book: Book | undefined = $state(undefined);
    let id = page.params.id || "";
    onMount(async () => {
        try {
            const response = await fetch(`${API_BASE}/read-watch/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                error(500, `${response.statusText}`);
            }

            console.log(response.text);
            book = await response.json();
        } catch (err) {
            console.log(err);
        }
    });
</script>

{#if book !== undefined}
    <ExpandedBookCard {book}></ExpandedBookCard>
{/if}
