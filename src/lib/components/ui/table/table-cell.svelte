<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';
	import { DataBodyRow, Render, type BodyCell } from 'svelte-headless-table';
	import type { Class } from '$lib/ics';
	import type { AnyPlugins } from 'svelte-headless-table/plugins';

	type $$Props = HTMLTdAttributes & { cell: BodyCell<Class, AnyPlugins> };

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let cell: BodyCell<Class, AnyPlugins>;

	const classNames = () => {
		let classes = '';
		if (cell.id === 'uid') classes += 'opacity-100';
		else if ((cell.row as DataBodyRow<Class, AnyPlugins>).original.removed) classes += 'opacity-30';
		return classes;
	};
</script>

<td
	class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', classNames())}
	{...$$restProps}
	on:click
	on:keydown
>
	{#if cell.id === 'uid'}
		<Render of={cell.render()} />
	{:else}
		{@html cell.render()}
	{/if}
</td>
