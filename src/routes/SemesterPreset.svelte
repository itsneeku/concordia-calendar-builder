<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { Table } from '$lib/components/ui/table';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { semesterPresets, selectedSemester } from '../lib/stores';

	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';

	let open = $state(false);
	const { onSettingChange } = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const onSelect = (selectedVal: string) => {
		selectedSemester.update((existingStore) => {
			existingStore.name = selectedVal;
			return existingStore;
		});
		open = false;
	};
</script>

<span class="mr-2">Preset</span>
<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-64 justify-between"
		>
			{$selectedSemester.name}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-64 p-0">
		<Command.Root>
			<Command.Group>
				{#each $semesterPresets as semester}
					<Command.Item value={semester.name} {onSelect}>
						<Check
							class={cn(
								'mr-2 h-4 w-4',
								$selectedSemester.name !== semester.name && 'text-transparent'
							)}
						/>
						{semester.name}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
