<script lang="ts">
    import type { Book } from "$lib/types";

    interface Props {
        book: Book;
        on_click: () => void;
    }

    let { book, on_click }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="book-card">
    <div>
        <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
        <img
            role="button"
            tabindex="0"
            src={book.cover_image}
            class="cover-image"
            class:explicit={book.explicit}
            alt={`Cover image of ${book.title}`}
            onclick={() => {
                on_click();
            }}
        />
    </div>
    <div class="book-info">
        <h2 class="book-title">{book.title}</h2>
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
</div>

<style>
    .book-card {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
        width: 100%;
        margin-bottom: 2rem;
    }

    .book-card::after {
        content: "";
        bottom: 0;
        left: 0;
        right: 0;
        height: 50%;
    }

    .cover-image {
        width: 100%;
        height: fit-content;
        object-fit: cover;
    }

    .cover-image.explicit {
        filter: blur(10px);
        transition: all 0.53s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    .cover-image.explicit:hover {
        filter: blur(0px);
    }

    .book-tags,
    .book-genres {
        display: flex;
        flex-wrap: wrap;
        gap: 0.212rem;
    }
</style>
