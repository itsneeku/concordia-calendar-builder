<script lang="ts">
	import Main from '../lib/components/schedule/main.svelte';
	import { createEventAttributes } from '$lib';
	import { slide } from 'svelte/transition';
	import { createEvents } from 'ics';
	import Button from '$lib/components/ui/button/button.svelte';
	import { classes } from '../lib/stores';
	import CoursesTable from '$lib/components/schedule/courses-table.svelte';


	const downloadIcs = (error: any, value: String) => {
		if (error) {
			console.error(error);
			return;
		}
		const blob = new Blob([value as BlobPart], { type: 'text/calendar' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'schedule.ics';
		a.click();
		URL.revokeObjectURL(url);
	};
</script>

<section class="my-24 text-center">
	<Main />
	{#if $classes.length > 0}
		<Button
			variant="outline"
			class="mb-8 mt-4"
			on:click={() => {
				createEvents(createEventAttributes($classes), downloadIcs);
			}}>Download .ics</Button
		>
		<div transition:slide class="container mx-auto flex flex-col items-center space-y-10 text-left">
			<CoursesTable />
			<!-- <SemesterSettings /> -->
			<!-- <DataTable /> -->
		</div>
	{/if}
</section>

<style>
</style>
