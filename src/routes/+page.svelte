<script>
    import { goto } from "$app/navigation";

</script>
<div class="routes-list">
    <button onclick={() => {
        goto("/lists/read-watch")
    }}>Read/Watch List</button>
    <button onclick={() => {
        goto("/login")
    }}>
        Login
    </button>
</div>