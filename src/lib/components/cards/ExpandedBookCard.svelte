<script lang="ts">
    import type { Book } from "$lib/types";

    interface Props {
        book: Book;
    }

    let { book }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
    role="button"
    tabindex="0"
    class="book-card"
>
    <div>
        <img
            src={book.cover_image}
            class="cover-image"
            class:explicit={book.explicit}
            alt={`Cover image of ${book.title}`}
        />
    </div>
    <div class="book-info">
        <h class="book-title">{book.title}</h>
        <p class="book-author">{book.author}</p>
        <div class="read-status">{book.status}</div>
        <div class="book-genres">
            {#each book.genres.slice(0, 5) as genre (genre)}
                <span class="book-genre">
                    <button>{genre}</button>
                </span>
            {/each}
        </div>

        <div class="book-tags">
            {#each book.tags.slice(0, 5) as tag (tag)}
                <span class="book-tag">
                    <button>{tag}</button>
                </span>
            {/each}
        </div>

        <div class="book-rating">
            <span class="stars">
                {#each Array(book.rating) as _, star}
                    <span
                        class="star"
                        class:filled={star + 1 <= book.rating}>★</span
                    >
                {/each}
            </span>
            <span class="rating-text"> </span>
        </div>
    </div>

    <div>Extra Info:</div>
    <div class="item-metadata">
        <h>Description:</h>
        <p>{book.description}</p>

        <h>My Thoughts:</h>
        <p>{book.my_thoughts}</p>
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
        width: 50%;
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
