<script lang="ts">
	import { type Course, days } from '$lib';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { isCourseFullyPopulated } from '$lib/parser';
	import { courses } from '$lib/state.svelte';
	import { nanoid } from 'nanoid';
	import { toast } from 'svelte-sonner';

	interface Props {
		course: Partial<Course> | null;
	}

	let { course = $bindable() }: Props = $props();

	let isNewCourse = $derived(course != null && Object.keys(course).length === 0);
	let open = $state(false);
	let formData: Partial<Course> = $state($state.snapshot(course)) as Partial<Course>;

	$effect(() => {
		console.log('in effect');
		if (course != null) {
			console.log('in effect if');
			open = true;
			formData = $state.snapshot(course);
		}
	});

	$inspect('courses', courses);

	const closeDialog = () => {
		[open, course] = [false, null];
	};

	const handleSaveCourse = async () => {
		if (!isCourseFullyPopulated(formData)) {
			toast.error('Please fill in all fields');
			return;
		}

		formData.uid ||= `${nanoid()}@concordiaCalendar.neeku.dev`;
		const index = courses.findIndex((c) => c.uid === formData.uid);

		if (index === -1) {
			courses.push(formData as Course);
			closeDialog();
			return;
		}

		// Dont update days if unchanged
		if (courses[index].days.toString() === formData.days?.toString()) {
			delete (formData as Partial<Course>).days;
		} else {
			formData.days.sort((a, b) => days.indexOf(a) - days.indexOf(b));
		}

		// Update each key rather than reassigning object
		Object.keys(formData).forEach((key) => {
			courses[index][key] = formData[key];
		});

		closeDialog();
	};

	const handleDeleteCourse = async () => {
		const index = courses.findIndex((c) => c.uid === formData.uid);
		courses[index] = {} as Course;
		closeDialog();
	};
</script>

<Dialog.Root
	bind:open
	onOpenChange={() => {
		course = null;
	}}
	openFocus={'#content-div'}
>
	<Dialog.Content class="max-w-sm rounded-lg" id="content-div">
		<Dialog.Header>
			<Dialog.Title class="text-center">{isNewCourse ? 'New' : 'Edit'} Course</Dialog.Title>
		</Dialog.Header>
		<div class="flex flex-col gap-4 pt-4">
			<div class="flex flex-col gap-1.5">
				<Label for="courseName" class="text-left">Course</Label>
				<Input id="courseName" bind:value={formData.name} autocomplete="no" />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="location" class="text-left">Location</Label>
				<Input id="location" bind:value={formData.location} autocomplete="no" />
			</div>

			<div class="flex flex-col gap-1.5">
				<Label for="days" class="text-left">Days</Label>
				<ToggleGroup.Root
					id="days"
					type="multiple"
					class="flex justify-between"
					bind:value={formData.days as string[]}
				>
					{#each days as day}
						<ToggleGroup.Item class="aspect-square size-10 border border-input" value={day}>
							{day[0]}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>
			</div>

			<div class="flex w-full flex-col gap-1.5">
				<Label for="days">Time</Label>
				<div class="flex items-center justify-between space-x-2">
					<Input type="time" class="min-w-0 text-center" bind:value={formData.startTime} />
					<span> - </span>
					<Input type="time" class="min-w-0 text-center" bind:value={formData.endTime} />
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button class="mt-2 h-12" onclick={handleSaveCourse}>
				{isNewCourse ? 'Add course' : 'Save changes'}
			</Button>
			{#if !isNewCourse}
				<Button class="mt-2 text-destructive" variant="outline" onclick={handleDeleteCourse}>
					Delete course
				</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
