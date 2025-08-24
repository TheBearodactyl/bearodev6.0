<script lang="ts">
    interface Props {
        genres: string[];
        on_click_genre: (genre: string) => Promise<void>;
    }

    let { genres, on_click_genre }: Props = $props();
</script>

<div class="tags-bar">
    <h2>Genres:</h2>
    {#each genres as genre}
        <button
            onclick={() => {
                on_click_genre(genre);
            }}
        >
            {genre}
        </button>
    {/each}
</div>

<style>
    .tags-bar {
        display: block;
        background-color: gainsboro;
        width: 90%;
        height: 5%;
    }
</style>
