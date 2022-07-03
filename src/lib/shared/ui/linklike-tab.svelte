<script lang="ts">
  import clsx from 'clsx';

  import { page } from '$app/stores';

  export let href: string;

  $: active = $page.url.pathname === href;
</script>

{#if active}
  <span class={clsx("font-medium", "text-lg")}>
    <slot />
  </span>
{:else}
  <a {href} class={clsx("font-medium", "text-lg", 'text-blue-500 underline cursor-pointer')}>
    <slot />
  </a>
{/if}
