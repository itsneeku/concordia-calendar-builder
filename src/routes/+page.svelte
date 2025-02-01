<script lang="ts">
	import { appState, courses } from '$lib/state.svelte';
	import { customFadeIn, customFadeOut } from '$lib/transitions';
	import Configure from './Configure.svelte';
	import Main from './Main.svelte';
	import { today } from '@internationalized/date';

	$inspect('appState', appState);
	console.log(appState.semester.endDate.compare(today('America/Toronto')));
</script>

{#if courses.length > 0 || appState.manualMode}
	<main class="h-full" in:customFadeIn out:customFadeOut>
		<Configure />
	</main>
{:else}
	<main class="h-full" in:customFadeIn out:customFadeOut>
		<Main />
	</main>
{/if}
