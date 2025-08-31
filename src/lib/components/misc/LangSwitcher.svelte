<script lang="ts">
  import { getLocale, locales, setLocale } from "$lib/paraglide/runtime";
  import { onMount } from "svelte";

  let selected_locale = $state(getLocale());

  function handle_change_locale() {
    setLocale(selected_locale, { reload: true });
  }

  onMount(() => {
    selected_locale = getLocale();
  });
</script>

<div class="locale-switcher">
  <select
    bind:value={selected_locale}
    onchange={handle_change_locale}
  >
    {#each locales as locale}
      <option value={locale}>{locale}</option>
    {/each}
  </select>
</div>
