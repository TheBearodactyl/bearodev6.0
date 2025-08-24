<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    let api_key = $state("");

    const save_api_key = () => {
        if (browser) {
            localStorage.setItem("api-key", api_key);
        }
    };

    onMount(() => {
        if (browser) {
            if (localStorage.getItem("api-key") && localStorage.getItem("api-key")?.trim() !== "") {
                api_key = localStorage.getItem("api-key") || "";
            }
        }
    });
</script>

<h2>Login:</h2>
<input
    bind:value={api_key}
    placeholder="Insert API key here..."
/>
<button onclick={save_api_key}>Save</button>
