<script lang="ts">
  import clsx from 'clsx';

  let _class = '';
  export { _class as class };

  export let label: string;
  export let icon: any;
</script>

<button class={clsx("text-blue-500", "p-2", "rounded-full", "hover:bg-blue-500/10", _class)} aria-label={label} title={label} on:click>
  <svelte:component this={icon} width={24} height={24} />
</button>
