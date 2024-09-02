<script lang="ts">
	import Roller from './Roller.svelte';
	import { Input } from '$lib/components/ui/input';
	import type { FormInputEvent } from '$lib/components/ui/input';
	import { handlePaste } from '$lib/ics';
	import { slide } from 'svelte/transition';
	import { CircleHelp } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	const calendars = ['Google Calendar', 'Apple Calendar', 'Microsoft Outlook', 'Samsung Calendar'];

	let showError = $state('');
	let showSuccess = $state(false);
	let showErrorInterval: number;

	const onPaste = (e: FormInputEvent<ClipboardEvent>) => {
		showSuccess = false;
		showError = '';
		try {
			handlePaste(e);
			showSuccess = true;
		} catch (err: any) {
			showError = err.message;
			clearInterval(showErrorInterval);
			showErrorInterval = setInterval(() => {
				showError = '';
			}, 3000);
		}
	};
</script>

<section
	style="flex: 0.25;"
	class="wrapper flex flex-auto flex-col items-center justify-center text-center"
>
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
			id="scheduleInput"
			placeholder="Paste your schedule"
			on:paste={onPaste}
			on:keypress={(e) => e.preventDefault()}
		></Input>
		<Tooltip.Root openDelay={100} closeOnPointerDown={false}>
			<Tooltip.Trigger>
				<CircleHelp strokeWidth={1.75} />
			</Tooltip.Trigger>
			<Tooltip.Content class="max-w-lg text-wrap text-justify">
				<ol class=" text-md list-inside list-decimal space-y-1 p-2">
					<li>
						Go to your <a
							class="underline"
							href="https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?Page=SSS_STUDENT_CENTER&Action=U&TargetFrameName=None"
							>Student Center</a
						>
					</li>
					<li>Copy your Schedule/Deadlines table as shown</li>
					<li>Paste it in the input field</li>
				</ol>
				<p>
					<enhanced:img src="$lib/images/tutorial.png" alt="Schedule/Deadlines table" class="p-2" />
				</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</form>
	{#if showError}
		<p transition:slide class="text-red-600 dark:text-red-400">{showError}</p>
	{/if}
	{#if true}
		<p transition:slide class="text-green-600 dark:text-green-400">
			Schedule successfully generated! <br /> Import the .ics file to your favourite calendar app.
		</p>
	{/if}
</section>

<style>
</style>
