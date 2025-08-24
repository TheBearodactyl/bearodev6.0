<script lang="ts">
    interface Props {
        tags: string[];
        on_click_tag: (tag: string) => Promise<void>;
    }

    let { tags, on_click_tag }: Props = $props();
</script>

<div class="tags-bar">
    <h2>Tags:</h2>
    {#each tags as tag}
        <button
            onclick={() => {
                on_click_tag(tag);
            }}
        >
            {tag}
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
