<script lang="ts">
	import Tooltip from './tooltip.svelte';
	import Roller from './roller.svelte';
	import { Input, type FormInputEvent } from '$lib/components/ui/input';
	import { parseInput } from '$lib';
	import { slide } from 'svelte/transition';
	import { classes } from '$lib/stores';
	let fileName = 'schedule.ics'; //TODO: Based on semester

	let showErrorInterval: number;
	let showError = $state('');
	let showSuccess = $state('');

	const handlePaste = (e: FormInputEvent<ClipboardEvent>) => {
		e.preventDefault();
		if (!e.clipboardData) {
			displayError(`Couldn't read your clipboard, try copying your schedule again.`);
			return;
		}

		classes.set(parseInput(e.clipboardData.getData('text')));

		if ($classes.length === 0) {
			displayError(`No classes found, are you sure you copied the right thing?`);
			return;
		}

		showError = '';
	};

	const displayError = (err: string) => {
		showError = err;
		clearInterval(showErrorInterval);
		showErrorInterval = setInterval(() => {
			showError = '';
		}, 3000);
	};
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-4 p-2 text-center text-5xl font-semibold tracking-tight lg:text-5xl">
		Concordia .ics Builder
	</h1>
	<div class="mb-4">
		<p>Easily add your Concordia schedule to</p>
		<Roller />
	</div>

	<form class="flex w-full max-w-sm items-center">
		<Input
			class="m-4 max-w-80"
			placeholder="Paste your schedule"
			on:paste={handlePaste}
			on:keypress={(e) => e.preventDefault()}
		></Input>
		<Tooltip />
	</form>
	{#if showError}
		<p transition:slide class="text-destructive">{showError}</p>
	{/if}
</div>

<style>
</style>
