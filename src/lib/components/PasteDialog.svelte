<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input/';
	import scheduleTableDesktop from '$lib/img/schedule-table-desktop.png?enhanced';
	import scheduleTableMobile from '$lib/img/schedule-table-mobile-short.png?enhanced';
	import { parseInput } from '$lib/parser';
	import { courses } from '$lib/state.svelte';
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		open: boolean;
	}
	let { open = $bindable(false) }: Props = $props();

	const onpaste = async (event: ClipboardEvent) => {
		event.preventDefault();
		if (!event.clipboardData) return;
		const pastedData = event.clipboardData.getData('text');
		let parsedCourses = parseInput(pastedData);

		if (parsedCourses.length > 0) {
			open = false;
			await tick();
			courses.push(...parsedCourses);
		} else {
			toast.error('Could not figure out what classes you got :(');
		}
	};
	let innerWidth = $state() as number;

	let scheduleTable = $derived(innerWidth < 640 ? scheduleTableMobile : scheduleTableDesktop);
</script>

<svelte:window bind:innerWidth />

<Dialog.Root bind:open openFocus={'#content-div'}>
	<Dialog.Content class="max-w-sm rounded-lg" id="content-div">
		<Dialog.Title class="text-center">Paste Schedule</Dialog.Title>

		<Dialog.Description class="flex  flex-col items-center gap-4 py-4">
			<p>
				1. Go to your <a
					class="underline"
					href="https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?Page=SSS_STUDENT_CENTER&Action=U&TargetFrameName=None"
					target="_blank"
					>Student Center > Academics
				</a>
			</p>
			<p>2. Copy your Schedule/Deadlines table as shown</p>

			<enhanced:img
				src={scheduleTable}
				class="w-80 rounded-lg border p-1"
				alt="Schedule/Deadlines table"
			/>

			<p>3. Paste it in the input field below</p>
			<Input placeholder="Paste your schedule" {onpaste} class="mt-4 max-w-xs " />
		</Dialog.Description>
	</Dialog.Content>
</Dialog.Root>
