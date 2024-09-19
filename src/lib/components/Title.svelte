<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	let index = $state(0);
	let roller: number;
	const calendars = ['Google Calendar', 'Apple Calendar', 'Microsoft Outlook', 'Samsung Calendar'];

	onMount(() => {
		roller = setInterval(() => {
			index = (index + 1) % calendars.length;
		}, 2000);
	});

	onDestroy(() => {
		clearInterval(roller);
	});

	const props = $props();
</script>

<div class={props.class}>
	<h1 class="mb-4 text-center font-serif text-5xl font-[50] tracking-tighter sm:text-9xl">
		Concordia <br /> Calendar Builder
	</h1>

	<div class="text-center text-sm sm:text-lg">
		<p>Easily add your Concordia schedule to</p>
		{#key index}
			<div transition:slide>
				{calendars[index]}
			</div>
		{/key}
	</div>
</div>
