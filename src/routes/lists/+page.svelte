<script>
    import { goto } from "$app/navigation";
</script>

<button onclick={() => goto("/lists/games")}>Games</button>
<button onclick={() => goto("/lists/read-watch")}>Read/Watch List</button>
