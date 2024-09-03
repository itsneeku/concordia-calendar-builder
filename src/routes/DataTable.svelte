<script lang="ts">
	import { type Class } from '$lib/ics';
	import {
		createTable,
		Render,
		Subscribe,
		createRender,
		type ReadOrWritable
	} from 'svelte-headless-table';
	import { type Writable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './DataTableActions.svelte';
	let {
		classes,
		onRemove
	}: {
		classes: Writable<Class[]>;
		onRemove: (name: string, comp: string) => void;
	} = $props();

	$effect(() => {
		table = createTable(classes);
	});

	let table = createTable(classes);
	const columns = table.createColumns([
		table.column({
			accessor: 'name',
			header: 'course'
		}),
		table.column({
			accessor: 'component',
			header: 'component'
		}),
		table.column({
			accessor: 'days',
			header: 'days',
			cell: ({ value }) => {
				return value.join(', ');
			}
		}),
		table.column({
			accessor: 'location',
			header: 'location',
			cell: ({ value }) => {
				const split = value.split(' ');
				if (split.length > 2) {
					const campus = split.pop();
					return split.join(' ') + ` <span class="font-semibold">${campus}</span>`;
				}
				return value;
			}
		}),
		table.column({
			accessor: ({ name, component }) => ({ name, component }),
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, {
					name: value.name,
					comp: value.component,
					onRemove: onRemove
				});
			}
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-lg border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									{#if cell.id === 'location'}
										{@html cell.render()}
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<style></style>
