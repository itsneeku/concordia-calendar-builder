<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	const calendars = ['Google Calendar', 'Apple Calendar', 'Microsoft Outlook', 'Samsung Calendar'];
	const interval = 2000;

	let index = $state(0);
	let roller: number;

	onMount(() => {
		roller = setInterval(() => {
			index = (index + 1) % calendars.length;
		}, interval);
	});

	onDestroy(() => {
		clearInterval(roller);
	});
</script>

{#key index}
	<div transition:slide>{calendars[index]}</div>
{/key}
