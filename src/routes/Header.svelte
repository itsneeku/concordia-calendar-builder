<script>
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import { Code, Sun, Moon } from 'lucide-svelte';
</script>

<header class="flex justify-end">
	<ModeWatcher />

	<Button
		on:click={() => (window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
		variant="ghost"
		size="icon"
	>
		<Code />
	</Button>

	<Button on:click={toggleMode} variant="ghost" size="icon">
		<Sun class="absolute scale-100 transition-all dark:scale-0 " />
		<Moon class="absolute scale-0 transition-all dark:scale-100" />
	</Button>
</header>
