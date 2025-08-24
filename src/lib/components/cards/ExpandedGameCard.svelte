<script lang="ts">
    import type { Game } from "$lib/types";

    interface Props {
        game: Game;
    }

    let { game }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
    role="button"
    tabindex="0"
    class="book-card"
>
    <div class="expanded-card">
        <div>
            <img
                src={game.cover_image}
                class="cover-image"
                class:explicit={game.explicit}
                alt={`Cover image of ${game.title}`}
            />
        </div>
        <div class="book-info">
            <h2 class="book-title">{game.title}</h2>
            <p class="book-author">{game.developer}</p>
            <div class="read-status">{game.status}</div>
            <div class="book-genres">
                {#each game.genres.slice(0, 5) as genre (genre)}
                    <span class="book-genre">
                        <button>{genre}</button>
                    </span>
                {/each}
            </div>

            <div class="book-tags">
                {#each game.tags.slice(0, 5) as tag (tag)}
                    <span class="book-tag">
                        <button>{tag}</button>
                    </span>
                {/each}
            </div>

            <div class="book-rating">
                <span class="stars">
                    {#each Array(game.rating) as _, star}
                        <span
                            class="star"
                            class:filled={star + 1 <= game.rating}>★</span
                        >
                    {/each}
                </span>
                <span class="rating-text"> </span>
            </div>
        </div>

        <div>Extra Info:</div>
        <div class="item-metadata">
            <h3>Description:</h3>
            <p>{game.description}</p>

            <h3>My Thoughts:</h3>
            <p>{game.my_thoughts}</p>

            <h3>My Progress %:</h3>
            <p>{game.percent}%</p>

            <h3>Links:</h3>
            {#each Object.entries(game.links) as [name, url]}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button>
                        {name}
                    </button>
                </a>
            {/each}
        </div>
    </div>
</div>

<style>
    .book-card {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        width: 100%;
    }

    .book-card::after {
        content: "";
        bottom: 0;
        left: 0;
        right: 0;
        height: 100%;
    }

    .cover-image {
        width: 25%;
        height: fit-content;
        object-fit: cover;
    }

    .book-tags,
    .book-genres {
        display: flex;
        flex-wrap: wrap;
        gap: 0.312rem;
    }
</style>
