<script lang="ts">
	import type { Course } from '$lib';
	import CourseDialog from '$lib/components/CourseDialog.svelte';
	import CourseList from '$lib/components/CourseList.svelte';
	import SemesterDialog from '$lib/components/SemesterDialog.svelte';

	let selectedCourse: Partial<Course> | null = $state(null);
</script>

<CourseList bind:selectedCourse class="mx-auto max-w-md pb-16 pt-14" />
<CourseDialog bind:course={selectedCourse} />
<SemesterDialog />
<!-- <CourseDialog bind:open={showSemesterDialog} /> -->
