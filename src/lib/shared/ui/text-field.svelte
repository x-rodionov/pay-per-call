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
    class="
      block
      my-2 mx-4
      font-medium
      text-gray-900 dark:text-gray-300
    "
	>
    {label}
  </label>
	<input
		{id}
		bind:value
		class={clsx(
			'bg-blue-50 border-2 border-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
			_class
		)}
    {...$$restProps}
	/>
</div>
