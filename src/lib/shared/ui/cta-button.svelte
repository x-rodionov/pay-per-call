<script lang="ts">
  import clsx from 'clsx';

  let _class = '';
  export { _class as class };
</script>

<button
	type="button"
	class={clsx(
    "text-white",
    "bg-blue-500 hover:bg-blue-600",
    "shadow",
    "focus:ring-4 focus:ring-blue-200 focus:outline-none",
    "font-semibold font-roboto-slab",
    "px-8 py-3",
    "dark:bg-blue-300 dark:hover:bg-blue-400",
    "dark:focus:ring-blue-800",
    "rounded-lg",
    _class
  )}
  on:click
  {...$$restProps}
>
  <slot />
</button>
