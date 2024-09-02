<script lang="ts">
	import '../app.css';
	import Header from './Header.svelte';
</script>

<div class="flex min-h-screen flex-col p-2">
	<Header></Header>

	<main class="flex flex-1 flex-col">
		<slot></slot>
	</main>
</div>
