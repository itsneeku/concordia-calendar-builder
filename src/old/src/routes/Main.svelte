<script lang="ts">
	import PasteDialog from '$lib/components/PasteDialog.svelte';
	import Title from '$lib/components/Title.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { appState } from '$lib/state.svelte';
	import { slide } from 'svelte/transition';

	// let manualMode = appState.isManualMode;
	let uploadDialogOpen = $state(false);

	let uploadScreenshotText = $state('Upload Screenshot');
	let timeout: number;

	const onClickUpload = () => {
		uploadScreenshotText = 'Coming Soon';
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			uploadScreenshotText = 'Upload Screenshot';
		}, 2000);
	};

	const onClickPaste = () => {
		uploadDialogOpen = true;
	};
</script>

<Title
	class="flex h-3/4 flex-col items-center justify-center rounded-lg border border-border bg-border bg-opacity-15"
/>
<div class="flex h-1/4 flex-col items-center justify-center">
	<div class="flex flex-col sm:flex-row">
		<Button class="m-1 h-12 w-60" variant="outline" onclick={onClickPaste}>Paste Schedule</Button>

		<Button class="m-1 h-12 w-60" variant="outline" onclick={onClickUpload}>
			<span>
				{#key uploadScreenshotText}
					<div transition:slide>{uploadScreenshotText}</div>
				{/key}
			</span>
		</Button>

		<PasteDialog bind:open={uploadDialogOpen} />
	</div>
	<div>
		<Button class="m-1 h-12 w-fit" variant="link" on:click={() => (appState.manualMode = true)}
			>Manual Mode</Button
		>
	</div>
</div>
