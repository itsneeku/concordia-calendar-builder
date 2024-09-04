<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus, X } from 'lucide-svelte';

	import * as Tooltip from '$lib/components/ui/tooltip';

	export let uid: string;
	export let onRemove: (uid: string) => void;
</script>

<Tooltip.Root openDelay={100} closeOnPointerDown={true}>
	<Tooltip.Trigger>
		<Button on:click={() => onRemove(uid)} variant="ghost" size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Remove</span>
			<X class="h-4 w-4" />
			<Plus class="h-4 w-4" />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content class="max-w-lg text-wrap text-justify">Remove</Tooltip.Content>
</Tooltip.Root>
