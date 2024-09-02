<script lang="ts">
	import Roller from './Roller.svelte';
	import { Input } from '$lib/components/ui/input';
	const calendars = ['Google Calendar', 'Apple Calendar', 'Microsoft Outlook', 'Samsung Calendar'];
</script>

<section
	style="flex: 0.25;"
	class="wrapper flex flex-auto flex-col items-center justify-center text-center"
>
	<h1 class="mb-4 p-2 text-center text-5xl font-semibold tracking-tight lg:text-5xl">
		Concordia .ics Builder
	</h1>
	<div class="mb-8">
		<p>Easily add your Concordia schedule to</p>
		<Roller data={calendars} interval={2000} />
	</div>

	<Input class="  max-w-80" id="scheduleInput" placeholder="Paste your schedule"></Input>
</section>

<style>
</style>
