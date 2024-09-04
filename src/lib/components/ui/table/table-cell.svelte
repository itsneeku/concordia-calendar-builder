<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';
	import { DataBodyRow, Render, type BodyCell } from 'svelte-headless-table';
	import type { Class } from '$lib/ics';
	import type { AnyPlugins } from 'svelte-headless-table/plugins';

	import { classes, editableCell } from '../../../../stores';
	import { Input } from '$lib/components/ui/input';

	type $$Props = HTMLTdAttributes & { cell: BodyCell<Class, AnyPlugins> };

	let className: $$Props['class'] = undefined;
	export { className as class };
	export let cell: BodyCell<Class, AnyPlugins>;
	let row = cell.row as DataBodyRow<Class, AnyPlugins>;

	const classNames = () => {
		let classes = '';
		if (cell.id === 'uid') classes += 'opacity-100';
		else if ((cell.row as DataBodyRow<Class, AnyPlugins>).original.removed) classes += 'opacity-30';
		return classes;
	};

	const handleClick = () => {
		if (row.original.removed) return;
		editableCell.set({ rowId: row.id, cellId: cell.id });
	};

	const getInputValue = () => {
		const currentClass = $classes.find((c) => c.uid === row.original.uid);
		if (cell.id === 'timeslot') return `$b`;
		return `${currentClass![cell.id as keyof Class]}`;
	};

	const handleChange = (e) => {
		const newVal = e.target.value;
		console.log(newVal);

		const currentClass = $classes.find((c) => c.uid === row.original.uid);
		classes.update((existingStore) => {
			existingStore.forEach((c) => {
				if (c.uid === row.original.uid) {
					c[cell.id as keyof Class] = newVal;
				}
			});
			return existingStore;
		});
	};
</script>

<td
	on:click={handleClick}
	class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', classNames())}
	{...$$restProps}
>
	{#if cell.id === 'uid'}
		<Render of={cell.render()} />
	{:else if $editableCell.rowId == row.id && $editableCell.cellId == cell.id}
		{#if cell.id === 'timeslot'}
			<Input type="time" value={getInputValue()} />
		{:else if cell.id === 'days'}
			<!-- TODO: Combobox -->
		{:else}
			<Input on:input={(e) => handleChange(e)} value={getInputValue()} />
		{/if}
	{:else}
		{@html cell.render()}
	{/if}
</td>
