<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { X } from 'lucide-svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let name: string;
	export let comp: string;
	export let onRemove: (name: string, comp: string) => void;
</script>

<Tooltip.Root openDelay={100} closeOnPointerDown={true}>
	<Tooltip.Trigger>
		<Button
			on:click={() => onRemove(name, comp)}
			variant="ghost"
			size="icon"
			class="relative h-8 w-8 p-0"
		>
			<span class="sr-only">Remove</span>
			<X class="h-4 w-4" />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content class="max-w-lg text-wrap text-justify">Remove</Tooltip.Content>
</Tooltip.Root>
