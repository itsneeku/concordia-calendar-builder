<script lang="ts">
	import { days, type Course } from '$lib';
	import * as Card from '$lib/components/ui/card';
	import { getICS } from '$lib/ics';
	import { appState, courses } from '$lib/state.svelte';
	import { customSlideIn, customSlideInstantIn, customSlideOut } from '$lib/transitions';
	import { Calendar, CalendarArrowDown, Clock, Plus, Settings2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		selectedCourse: Partial<Course> | null;
		class?: string;
	}

	let { selectedCourse = $bindable({}), ...props }: Props = $props();

	const onDownload = () => {
		try {
			const blob = new Blob([getICS(courses, appState.semester)], {
				type: 'text/calendar'
			});
			const url = URL.createObjectURL(blob);
			const downloader = document.createElement('a');
			downloader.href = url;
			downloader.download = 'schedule.ics';
			downloader.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error(error);
			toast.error('Failed to download schedule.ics');
		}

		toast.success('Schedule downloaded. Import it to your calendar app.');
	};
</script>

<div class="flex flex-col space-y-6 {props.class}">
	<div class="flex space-x-6">
		<Card.Root
			class="size-full  bg-border bg-opacity-15 px-8 py-4 hover:bg-opacity-100"
			onclick={() => (appState.semesterDialog = true)}
		>
			<Card.Content class="p-0">
				<div class="flex items-center justify-center"><Settings2 class="h-5 w-5" /></div>
			</Card.Content>
		</Card.Root>

		<Card.Root
			class="size-full bg-border bg-opacity-15 px-8 py-4 hover:bg-opacity-100"
			onclick={onDownload}
		>
			<Card.Content class="p-0">
				<div class="flex items-center justify-center"><CalendarArrowDown class="h-5 w-5" /></div>
			</Card.Content>
		</Card.Root>
	</div>

	{#each courses as course}
		{#if course.uid != null}
			<div in:customSlideInstantIn|global out:customSlideOut>
				<Card.Root
					class="h-32 bg-border bg-opacity-15 px-6 transition-all hover:bg-opacity-100"
					onclick={() => (selectedCourse = course)}
				>
					<Card.Content class="grid h-full grid-cols-2 grid-rows-2 items-center p-0">
						<div class="order-1 font-semibold">
							{#key course.name}
								<div in:customSlideIn out:customSlideOut>
									{course.name}
								</div>
							{/key}
						</div>

						<div class="order-2 justify-self-end opacity-50">
							{#key course.location}
								<div in:customSlideIn out:customSlideOut>
									{course.location}
								</div>
							{/key}
						</div>

						<div class="order-3">
							{#key course.days}
								<div class="flex gap-[0.2rem]" in:customSlideIn out:customSlideOut>
									<Calendar class="h-4 w-4 self-center" />

									{#each days as day}
										<span class={course.days.includes(day) ? 'opacity-100' : 'opacity-50'}>
											{day.substring(0, 1)}
										</span>
									{/each}
								</div>
							{/key}
						</div>

						<div class="order-4 justify-self-end">
							{#key course.startTime + course.endTime}
								<div class="flex gap-1" in:customSlideIn out:customSlideOut>
									<Clock class="h-4 w-4 self-center" />
									<span class="w-26">{course.startTime} - {course.endTime}</span>
								</div>
							{/key}
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		{/if}
	{/each}

	<Card.Root
		class="size-full bg-border bg-opacity-15 px-8 py-4 hover:bg-opacity-100"
		onclick={() => (selectedCourse = {})}
	>
		<Card.Content class="p-0">
			<div class="flex items-center justify-center">
				<Plus class="h-5 w-5" />
			</div>
		</Card.Content>
	</Card.Root>
</div>
