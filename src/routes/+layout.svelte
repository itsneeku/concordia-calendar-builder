<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	interface LayoutProps {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		children: any;
	}

	let { children }: LayoutProps = $props();
</script>

<div>
	<Toaster duration={2000} position="top-center" richColors />
	<!-- max-w-full overflow-x-hidden  -->
	<ModeWatcher />
	<Header />
	<div class="h-svh p-4">
		{@render children()}
	</div>
</div>
