<script lang="ts">
	import Roller from './Roller.svelte';
	import { Input } from '$lib/components/ui/input';
	import type { FormInputEvent } from '$lib/components/ui/input';
	import { handlePaste } from '$lib/ics';
	import { slide } from 'svelte/transition';
	import { CircleHelp } from 'lucide-svelte';

	const calendars = ['Google Calendar', 'Apple Calendar', 'Microsoft Outlook', 'Samsung Calendar'];

	let showError = $state('');
	let showErrorInterval: number;

	const onPaste = (e: FormInputEvent<ClipboardEvent>) => {
		showError = '';
		try {
			handlePaste(e);
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
		<CircleHelp strokeWidth={1.75} />
	</form>
	{#if showError}
		<p transition:slide class="text-red-600 dark:text-red-400">{showError}</p>
	{/if}
</section>

<style>
</style>
