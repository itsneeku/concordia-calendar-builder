<script lang="ts">
	import { CircleHelp } from 'lucide-svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
</script>

<Popover.Root portal={null}>
	<Popover.Trigger>
		<CircleHelp strokeWidth={1.75} />
	</Popover.Trigger>
	<Popover.Content
		side="bottom"
		class="w-[32rem] text-wrap text-left"
		fitViewport={true}
		overlap={true}
	>
		<ol class="list-inside list-decimal space-y-1 p-2">
			<li>
				Go to your <a
					class="underline"
					href="https://campus.concordia.ca/psc/pscsprd/EMPLOYEE/SA/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?Page=SSS_STUDENT_CENTER&Action=U&TargetFrameName=None"
					target="_blank">Student Center</a
				>
			</li>
			<li>Copy your Schedule/Deadlines table as shown</li>
			<li>Paste it in the input field</li>
		</ol>
		<p>
			<enhanced:img src="$lib/images/tutorial.png" alt="Schedule/Deadlines table" class="p-2" />
		</p>
	</Popover.Content>
</Popover.Root>

<style>
</style>
