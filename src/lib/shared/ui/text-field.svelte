<script lang="ts">
	import clsx from 'clsx';

	let _class = '';
	export { _class as class };

  export let id: string;
  export let label: string;
	export let value = '';

	export let labelInline = false;
</script>

<div class={clsx('flex', labelInline ? 'items-center' : 'flex-col',)}>
	<label
    for={id}
    class={clsx(
      "block",
      "my-2",
			labelInline && "mx-4",
      "font-medium",
		)}
	>
    {label}
  </label>
	<input
		{id}
		bind:value
		class={clsx(
			'bg-blue-50',
			'border-2 border-blue-500',
			'text-gray-900',
			'text-sm',
			'rounded-lg',
			'focus:ring-blue-500 focus:border-blue-500',
			'block',
			'w-full',
			'p-2.5',
			'dark:bg-slate-700 dark:text-slate-100',
			_class
		)}
    {...$$restProps}
	/>
</div>
