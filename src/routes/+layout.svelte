<script lang="ts">
  import { page } from "$app/state";
  import favicon from "$lib/assets/favicon.svg";
  import LangSwitcher from "$lib/components/misc/LangSwitcher.svelte";
  import { locales, localizeHref } from "$lib/paraglide/runtime";

  let { children } = $props();
</script>

<svelte:head>
  <link
    rel="icon"
    href={favicon}
  />
</svelte:head>

<div class="quick-buttons">
  <LangSwitcher />
</div>

{@render children?.()}

<div style="display: none;">
  {#each locales as locale}
    <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
  {/each}
</div>

<style lang="scss">
  :global {
    @import url("/src/lib/assets/scss/styles.scss");
  }

  .quick-buttons {
    position: sticky !important;
  }
</style>
