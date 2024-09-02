<script lang="ts">
	import Roller from './Roller.svelte';
	const calendars = ['Google Calendar', 'Apple Calendar', 'Microsoft Outlook', 'Samsung Calendar'];
</script>

<div class="justify-center text-center">
	<h1 class="mb-4 text-center text-5xl font-semibold tracking-tight lg:text-5xl">
		Concordia .ics Builder
	</h1>
	<div>
		<p>Easily add your Concordia schedule to</p>
		<Roller data={calendars} interval={2000} />
	</div>
</div>

<style>
</style>
