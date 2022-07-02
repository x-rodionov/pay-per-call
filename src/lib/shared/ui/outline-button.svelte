<script lang="ts">
  import clsx from 'clsx';

  let _class = '';
  export { _class as class };
</script>

<button
	type="button"
	class={clsx(
    "text-blue-500",
    "border-2",
    "border-blue-500 hover:border-blue-600",
    "disabled:border-gray-500 disabled:text-gray-500",
    "disabled:cursor-not-allowed",
    "focus:ring-4 focus:ring-blue-200 focus:outline-none",
    "font-semibold font-roboto-slab",
    "px-8 py-2",
    "dark:text-blue-300",
    "dark:border-blue-300 dark:hover:border-blue-400",
    "dark:focus:ring-blue-800",
    "rounded-lg",
    _class
  )}
  on:click
  {...$$restProps}
>
  <slot />
</button>
