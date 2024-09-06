<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';
	import { type Days, type Class } from '$lib/types';
	import { classes, activeCell } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { Minus, MoveRight, Plus, X } from 'lucide-svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import CellCombobox from './cell-combobox.svelte';
	import Input from '../input/input.svelte';
	type $$Props = HTMLTdAttributes & { course: Class; column: string };

	let className: $$Props['class'] = undefined;

	export let course: Class;
	export let column: string;
	export { className as class };
</script>

<td
	class={cn(`p-4 align-middle [&:has([role=checkbox])]:pr-0`, className)}
	{...$$restProps}
	on:keydown
>
	<slot />
	{#if column === 'action'}
		<Button
			variant="ghost"
			size="icon"
			on:click={() => {
				classes.update((cls) =>
					cls.map((c) => (c.uid === course.uid ? { ...c, removed: !c.removed } : c))
				);
				console.log('classes', $classes);
			}}
			aria-label={course.removed ? 'Restore course' : 'Remove course'}
		>
			{#if course.removed}
				<Plus class="h-4 w-4" />
			{:else}
				<X class="h-4 w-4" />
			{/if}
		</Button>
	{:else if column === 'days'}
		<CellCombobox {course} />
	{:else if column === 'timeslot'}
		<span class="flex items-center justify-center">
			<Input
				disabled={course.removed}
				class="max-w-inherit min-h-fit w-28  resize-none overflow-auto border-transparent bg-inherit px-4 py-2 text-center transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-border  focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none"
				type="time"
				bind:value={course.startTime}
			/>
			<Minus class="mx-2 h-4 w-4 {course.removed ? 'opacity-50' : ''}" strokeWidth={1} />
			<Input
				disabled={course.removed}
				class="max-w-inherit min-h-fit w-28 resize-none overflow-auto border-transparent bg-inherit px-4 py-2 text-center transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-border  focus-visible:bg-background focus-visible:ring-0 focus-visible:ring-offset-0 disabled:pointer-events-none"
				type="time"
				bind:value={course.endTime}
			/>
		</span>
	{:else}
		<Textarea
			disabled={course.removed}
			rows={1}
			required
			placeholder={column}
			autocomplete="off"
			autocorrect="off"
			spellcheck={false}
			bind:value={course[column]}
			on:change={() => console.log($classes)}
			class="max-w-inherit min-h-fit min-w-36 resize-none overflow-auto border-transparent bg-inherit px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:border-border focus-visible:bg-background focus-visible:ring-0  focus-visible:ring-offset-0 disabled:pointer-events-none "
			onkeydown={(e) => e.key === 'Enter' && e.preventDefault()}
		/>
	{/if}
</td>
