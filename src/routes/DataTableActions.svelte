<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus, X } from 'lucide-svelte';

	import * as Tooltip from '$lib/components/ui/tooltip';
	import { classes } from '../stores';
	import type { Class } from '$lib/ics';

	export let uid: string;

	const updateStore = () => {
		classes.update((existingStore) => {
			existingStore.forEach((c) => {
				if (c.uid === uid) {
					c.removed = !c.removed;
				}
			});
			return existingStore;
		});
	};
</script>

<Tooltip.Root openDelay={100} closeOnPointerDown={true}>
	<Tooltip.Trigger>
		<Button on:click={updateStore} variant="ghost" size="icon" class="relative h-8 w-8 p-0">
			{#if $classes.find((c) => c.uid === uid)?.removed}
				<span class="sr-only">Add</span>
				<Plus class="h-4 w-4" />
			{:else}
				<span class="sr-only">Remove</span>
				<X class="h-4 w-4" />
			{/if}
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content class="max-w-lg text-wrap text-justify">
		{#if $classes.find((c) => c.uid === uid)?.removed}
			Add
		{:else}
			Remove
		{/if}
	</Tooltip.Content>
</Tooltip.Root>
