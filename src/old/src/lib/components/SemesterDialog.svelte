<script lang="ts">
	import { presetSemesters, type Semester } from '$lib';
	import * as Accordion from '$lib/components/ui/accordion/';
	import { Button } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover/';
	import { ScrollArea } from '$lib/components/ui/scroll-area/';
	import * as Select from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator/';
	import { appState } from '$lib/state.svelte';
	import { customSlideInstantIn, customSlideOut } from '$lib/transitions';
	import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import type { Selected } from 'bits-ui';
	import { X } from 'lucide-svelte';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { toast } from 'svelte-sonner';

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let calendarOpen = $state({ startDate: false, endDate: false, excludedDates: false });
	let formData: Semester = $state({
		startDate: appState.semester.startDate,
		endDate: appState.semester.endDate
	}) as Semester;
	let selectedPreset: Selected<string> = $state({
		value: appState.semester.name,
		label: appState.semester.name
	});
	let excludedDates = $state([...appState.semester.excludedDates]);

	// const onSelectedChange = (value: Selected<string> | unknown) => {
	// 	const newPreset = presetSemesters.find((s) => s.name === (value as Selected<string>).value);
	// 	if (!selectedPreset || !newPreset) return;
	// 	formData.startDate = newPreset.startDate;
	// 	formData.endDate = newPreset.endDate;
	// 	selectedPreset.value = selectedPreset.label = newPreset.name;
	// 	excludedDates = [...newPreset.excludedDates];
	// };

	const handleSave = () => {
		if (formData.startDate.compare(formData.endDate) >= 0) {
			toast.error('End date must be after start date');
			return;
		}
		appState.semester = {
			...appState.semester,
			startDate: formData.startDate!,
			endDate: formData.endDate!,
			name: selectedPreset.value,
			excludedDates: excludedDates
		};
		appState.semesterDialog = false;
	};

	const onOpenChange = () => {
		formData.startDate = appState.semester.startDate;
		formData.endDate = appState.semester.endDate;
		selectedPreset.value = selectedPreset.label = appState.semester.name;
		excludedDates = [...appState.semester.excludedDates];
	};

	// const onAddExcludedDate = (e: DateValue | undefined) => {
	// 	if (!e) return;
	// 	excludedDates.push(e);
	// 	excludedDates.sort((a, b) => {
	// 		if (a === null) return 1;
	// 		if (b === null) return -1;
	// 		return a.compare(b ?? a);
	// 	});
	// 	onCustomDateChange();
	// };

	// const onCustomDateChange = () => {
	// 	calendarOpen.startDate = calendarOpen.endDate = calendarOpen.excludedDates = false;
	// 	selectedPreset.value = selectedPreset.label = 'Custom';
	// };

	$inspect('semesterDialog formData', formData);
</script>

<Dialog.Root bind:open={appState.semesterDialog} {onOpenChange}>
	<Dialog.Content class="max-w-sm rounded-lg" id="content-div">
		<Dialog.Header>
			<Dialog.Title class="text-center">Semester</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4 pt-4">
			<div class="flex flex-col gap-1.5">
				<Label for="courseName" class="text-left">Preset</Label>
			</div>
			<div class="flex gap-4">
				<div class="size-1/2">
					<Label for="startDate">Start Date</Label>
					<Popover.Root bind:open={calendarOpen.startDate}>
						<Popover.Trigger class="w-full py-0.5" id="startDate">
							<Button
								variant="outline"
								class="w-full justify-start {calendarOpen.startDate
									? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
									: ''}"
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{formData.startDate ? df.format(formData.startDate.toDate(getLocalTimeZone())) : ''}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" sideOffset={4} align="start"></Popover.Content>
					</Popover.Root>
				</div>
				<div class="size-1/2">
					<Label for="endDate">End Date</Label>
					<Popover.Root bind:open={calendarOpen.endDate}>
						<Popover.Trigger class="w-full py-0.5" id="endDate">
							<Button
								variant="outline"
								class="w-full justify-start {calendarOpen.endDate
									? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
									: ''}"
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{formData.endDate ? df.format(formData.endDate.toDate(getLocalTimeZone())) : ''}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" sideOffset={4} align="end"></Popover.Content>
					</Popover.Root>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button class="h-12" onclick={handleSave}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
