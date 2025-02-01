import type { Course, Semester } from '$lib';
import { presetSemesters } from '$lib';
import { today } from '@internationalized/date';

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
	semester:
		presetSemesters.find(
			(s) =>
				s.startDate.compare(today('America/Toronto')) < 0 &&
				s.endDate.compare(today('America/Toronto')) > 0 &&
				!s.name.includes('Fall/Winter')
		) || presetSemesters[presetSemesters.length - 1]
});
