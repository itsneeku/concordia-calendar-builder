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

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
</style>
