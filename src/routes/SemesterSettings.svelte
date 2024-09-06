<script lang="ts">
	import SemesterPreset from './SemesterPreset.svelte';

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

	let open = false;
	let value = $semesterPresets[0].name;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let dateValue: DateValue | undefined = undefined;

	$: selectedValue =
		$semesterPresets.find((f) => f.name === value)?.name ?? 'Select a  semester...';

	const onSelect = (selectedVal: string) => {
		value = selectedVal;
		open = false;
	};

	const onSettingChange = () => {
		$selectedSemester.name = 'Custom';
	};
</script>

<Accordion.Root class="xs:w-auto w-9/12">
	<Accordion.Item value="settings">
		<Accordion.Trigger>Semester: {$selectedSemester.name}</Accordion.Trigger>
		<Accordion.Content class="flex p-2">
			<div class="mb-7">
				<SemesterPreset {onSettingChange} />
			</div>
			<div class="">
				<span class="mr-2">Excluded Dates</span>
				<Popover.Root>
					<Popover.Trigger asChild let:builder>
						<Button
							variant="outline"
							class={cn(
								'w-[280px] justify-start text-left font-normal',
								!dateValue && 'text-muted-foreground'
							)}
							builders={[builder]}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Pick a date'}
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0">
						<Calendar bind:value={dateValue} initialFocus />
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="">
				<span class="mr-2">Semester Start Date</span>
				<Popover.Root>
					<Popover.Trigger asChild let:builder>
						<Button
							variant="outline"
							class={cn(
								'w-[280px] justify-start text-left font-normal',
								!dateValue && 'text-muted-foreground'
							)}
							builders={[builder]}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Pick a date'}
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0">
						<Calendar bind:value={dateValue} initialFocus />
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="">
				<span class="mr-2">Semester End Date</span>
				<Popover.Root>
					<Popover.Trigger asChild let:builder>
						<Button
							variant="outline"
							class={cn(
								'w-[280px] justify-start text-left font-normal',
								!dateValue && 'text-muted-foreground'
							)}
							builders={[builder]}
						>
							<CalendarIcon class="mr-2 h-4 w-4" />
							{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Pick a date'}
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0">
						<Calendar bind:value={dateValue} initialFocus />
					</Popover.Content>
				</Popover.Root>
			</div>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
