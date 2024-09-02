<script lang="ts">
	import '../app.css';
	import Header from './Header.svelte';
</script>

<div class="app">
	<Header></Header>

	<main>
		<slot></slot>
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 0.5rem;
	}

	main {
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
	}
</style>
