<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { classes } from '$lib/stores';
	import { type Days, type Class, DaysFull } from '$lib/types';

	// $effect(() => {
	// 	if (!open) {
	// 		tick().then(() => onClose());
	// 	}
	// });

	let open = $state(false);

	const { course }: { course: Class } = $props();

	const getSelectedDays = (): Days[] => $classes.find((c) => c.uid === course.uid)!.days;

	const onSelect = (selectedDay: Days) => {
		if (course.days.length === 1 && course.days.includes(selectedDay as Days)) {
			return;
		}
		classes.update((cls) =>
			cls.map((c) => {
				if (c.uid === course.uid) {
					c.days = c.days.includes(selectedDay)
						? c.days.filter((d) => d !== selectedDay)
						: [...c.days, selectedDay];
				}
				return c;
			})
		);
	};

	function handleMenuClose() {
		console.log('close');
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button
			on:mouseleave={handleMenuClose}
			disabled={course.removed}
			class={cn(
				'w-full',
				'overflow-ellipsis',
				'justify-between',
				'border',
				'border-transparent',
				'focus-visible:border-border',
				open && 'border-border',
				'focus-visible:ring-offset-0',
				'focus-visible:ring-0'
			)}
			builders={[builder]}
			variant="ghost"
			role="combobox"
			aria-expanded={open}
			><span class="overflow-hidden overflow-ellipsis font-normal">
				{getSelectedDays()
					.map((day) => DaysFull[day])
					.sort((a, b) => Object.values(DaysFull).indexOf(a) - Object.values(DaysFull).indexOf(b))
					.join(', ')}</span
			>
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-56 p-0" overlap={true} sideOffset={4}>
		<Command.Root>
			<Command.Group>
				{#each Object.keys(DaysFull) as Days[] as day}
					<Command.Item value={day} onSelect={(day) => onSelect(day as Days)}>
						<Check
							class={cn('mr-2 h-4 w-4', !getSelectedDays().includes(day) && 'text-transparent')}
						/>
						{DaysFull[day]}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
