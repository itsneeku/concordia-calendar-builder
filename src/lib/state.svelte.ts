import type { Course, Semester } from '$lib';
import { presetSemesters } from '$lib';

type AppState = {
	manualMode: boolean;
	semesterDialog: boolean;
	courseDialog: Partial<Course> | boolean;
	semester: Semester;
};

export const courses = $state<Course[]>([]);
export const appState = $state<AppState>({
	manualMode: false,
	semesterDialog: false,
	courseDialog: false,
	semester: presetSemesters[0]
});
