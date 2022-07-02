<script lang="ts">
  import clsx from 'clsx';

  export let active = false;
</script>

<span class={clsx("font-medium", "text-lg", !active && 'text-blue-500 underline cursor-pointer')}>
  <slot />
</span>
