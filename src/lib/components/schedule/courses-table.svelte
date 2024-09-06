<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { classes } from '$lib/stores';
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>course</Table.Head>
			<Table.Head>location</Table.Head>
			<Table.Head>days</Table.Head>
			<Table.Head class="text-center">time</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each $classes as course (course.uid)}
			<Table.Row>
				<Table.Cell {course} column="name" class="max-w-36 font-medium" />

				<Table.Cell column="location" {course} class="max-w-36" />

				<Table.Cell class="max-w-36" column="days" {course} />

				<Table.Cell class="max-w-68" column="timeslot" {course} />

				<Table.Cell column="action" {course} class="w-12" />
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

<style>
</style>
