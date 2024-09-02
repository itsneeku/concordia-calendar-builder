<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';

	let { data, interval }: { data: any[]; interval: number } = $props();
	let index = $state(0);
	let roller: number;

	onMount(() => {
		roller = setInterval(() => {
			if (index === data.length - 1) index = 0;
			else index++;
		}, interval);
	});

	onDestroy(() => {
		clearInterval(roller);
	});
</script>

{#key index}
	<div transition:slide>{data[index]}</div>
{/key}
