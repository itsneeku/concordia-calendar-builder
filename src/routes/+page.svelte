<script lang="ts">
	import Roller from './Roller.svelte';
	import { Input, type FormInputEvent } from '$lib/components/ui/input';
	import { parseInput, createEventAttributes, type Class } from '$lib/ics';
	import { slide } from 'svelte/transition';
	import { CircleHelp } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { createEvents, type EventAttributes } from 'ics';
	import DataTable from './DataTable.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { classes } from '../stores';

	const calendars = ['Google Calendar', 'Apple Calendar', 'Microsoft Outlook', 'Samsung Calendar'];
	let fileName = 'schedule.ics'; //TODO: Based on semester

	let showErrorInterval: number;
	let showError = $state('');
	let showSuccess = $state('');

	const handlePaste = (e: FormInputEvent<ClipboardEvent>) => {
		e.preventDefault();
		if (!e.clipboardData) return;
		({ showSuccess, showError } = { showSuccess: '', showError: '' });

		classes.set(parseInput(e.clipboardData.getData('text')));

		if ($classes.length === 0) {
			displayError('No classes found, are you sure you copied the right thing?');
			return;
		}
		showSuccess = `Schedule successfully generated!<br/>Once you're done editing, import the .ics file to your favourite calendar app.`;
	};

	const displayError = (err: string) => {
		showError = err;
		clearInterval(showErrorInterval);
		showErrorInterval = setInterval(() => {
			showError = '';
		}, 3000);
	};

	const downloadIcs = (error: any, value: String) => {
		const blob = new Blob([value as BlobPart], { type: 'text/calendar' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		a.click();
		URL.revokeObjectURL(url);
	};
</script>

<section class="my-24 text-center">
	<div class="flex flex-col items-center">
		<h1 class="mb-4 p-2 text-center text-5xl font-semibold tracking-tight lg:text-5xl">
			Concordia .ics Builder
		</h1>
		<div class="mb-4">
			<p>Easily add your Concordia schedule to</p>
			<Roller data={calendars} interval={2000} />
		</div>

		<form class="flex w-full max-w-sm items-center">
			<Input
				class="m-4 max-w-80"
				placeholder="Paste your schedule"
				on:paste={handlePaste}
				on:keypress={(e) => e.preventDefault()}
			></Input>
			<Tooltip.Root openDelay={100} closeOnPointerDown={false}>
				<Tooltip.Trigger>
					<CircleHelp strokeWidth={1.75} />
				</Tooltip.Trigger>
				<Tooltip.Content
					side="bottom"
					class=" max-h-fit max-w-fit text-wrap text-justify"
					fitViewport={true}
					overlap={true}
				>
					<ol class=" text-md list-inside list-decimal space-y-1 p-2">
						<li>
							Go to your <a
								class="underline"
								href="https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?Page=SSS_STUDENT_CENTER&Action=U&TargetFrameName=None"
								target="_blank">Student Center</a
							>
						</li>
						<li>Copy your Schedule/Deadlines table as shown</li>
						<li>Paste it in the input field</li>
					</ol>
					<p>
						<enhanced:img
							src="$lib/images/tutorial.png"
							alt="Schedule/Deadlines table"
							class="p-2"
						/>
					</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</form>
	</div>
	{#if showError}
		<p transition:slide class="text-primary">{showError}</p>
	{/if}
	{#if $classes.length > 0}
		<Button
			variant="outline"
			class="my-4"
			on:click={() => {
				createEvents(createEventAttributes($classes), downloadIcs);
			}}>Download .ics</Button
		>
		<div transition:slide class="container mx-auto text-left">
			<DataTable />
		</div>
	{/if}
</section>

<style>
</style>
