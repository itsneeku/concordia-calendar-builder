<script lang="ts">
	import { classes } from '../stores';
	import {
		createTable,
		Render,
		Subscribe,
		createRender,
		type DataBodyRow
	} from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './DataTableActions.svelte';

	const table = createTable(classes);
	const columns = table.createColumns([
		table.column({
			accessor: ({ name, component }) => `${name} ${component}`,
			header: 'course',
			cell: ({ value }) => {
				const values = value.split(' ');
				return `<span class="font-semibold"> ${values[0]} ${values[1]} </span> ${values[2]}`;
				// return value.split(' ').splice(0, 2).join(' ');
			}
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
					return `<span class="font-semibold">${split.join(' ')}</span> ${campus}`;
				}
				return value;
			}
		}),
		table.column({
			accessor: 'timeslot',
			header: 'time',
			cell: ({ value }) => {
				return `${value.start.hour.toString().padStart(2, '0')}:${value.start.minute.toString().padStart(2, '0')} - ${value.end.hour.toString().padStart(2, '0')}:${value.end.minute.toString().padStart(2, '0')}`;
			}
		}),
		table.column({
			accessor: 'uid',
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, {
					uid: value
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
					<Table.Row
						{...rowAttrs}
						class={(row as DataBodyRow<Class>).original.removed ? 'opacity-25' : ''}
					>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									{#if cell.id === 'uid'}
										<Render of={cell.render()} />
									{:else}
										{@html cell.render()}
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
