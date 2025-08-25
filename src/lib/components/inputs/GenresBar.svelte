<script lang="ts">
    interface Props {
        genres: string[];
        on_click_genre: (genre: string) => Promise<void>;
    }

    let { genres, on_click_genre }: Props = $props();
</script>

<div class="tags-bar">
    <h2 class="header-label">Genres</h2>
    <div class="tags-container">
        {#each genres as genre}
            <button
                class="tag-button"
                onclick={() => {
                    on_click_genre(genre);
                }}
            >
                {genre}
            </button>
        {/each}
    </div>
</div>