<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { appState, courses } from '$lib/state.svelte';
	import { customFadeIn, customFadeOut } from '$lib/transitions';
	import { ChevronLeft } from 'lucide-svelte';
	import Code from 'lucide-svelte/icons/code';
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { toggleMode } from 'mode-watcher';

	let scrollY: number = $state(0);
	const repoUrl: string = 'https://github.com/itsneeku/concordia-ics-builder';
</script>

<svelte:window bind:scrollY />

{#if courses.length > 0 || appState.manualMode}
	<header
		in:customFadeIn
		out:customFadeOut
		class="fixed left-0 top-0 m-4 flex transition-all
	{scrollY > 0 ? 'opacity-0' : 'opacity-100'}"
	>
		<Button
			onclick={() => {
				courses.splice(0);
				appState.manualMode = false;
			}}
			variant="ghost"
			size="icon"
		>
			<ChevronLeft />
		</Button>
	</header>
{/if}

<header
	class="fixed right-0 top-0 m-4 flex transition-all
	{scrollY > 0 ? 'opacity-0' : 'opacity-100'}"
>
	<Button onclick={() => window.open(repoUrl, '_blank')} variant="ghost" size="icon">
		<Code />
	</Button>
	<Button on:click={toggleMode} variant="ghost" size="icon">
		<Sun class="absolute scale-100 transition-all dark:scale-0 " />
		<Moon class="absolute scale-0 transition-all dark:scale-100" />
	</Button>
</header>
