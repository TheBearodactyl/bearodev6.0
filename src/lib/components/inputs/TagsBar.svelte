<script lang="ts">
    interface Props {
        tags: string[];
        on_click_tag: (tag: string) => Promise<void>;
    }

    let { tags, on_click_tag }: Props = $props();
</script>

<div class="tags-bar">
    <h2 class="header-label">Tags</h2>
    <div class="tags-container">
        {#each tags as tag}
            <button
                class="tag-button"
                onclick={() => {
                    on_click_tag(tag);
                }}
            >
                {tag}
            </button>
        {/each}
    </div>
</div>