import { readable, writable, type Readable, type Writable } from 'svelte/store';
import { getReadingWeek } from '$lib';
import { type Class } from '$lib/types';
import testClasses from '$lib/testClasses.json';
import type { DateArray } from 'ics';

type Semester = {
	name: string;
	startDate: number[];
	endDate: number[];
	excludedDates: DateArray[];
};

const semesters: Semester[] = [
	{
		name: 'Fall 2024',
		startDate: [2024, 9, 3],
		endDate: [2024, 12, 3],
		excludedDates: getReadingWeek(2024, 10, 14, 18)
	},
	{
		name: 'Winter 2025',
		startDate: [2025, 1, 6],
		endDate: [2025, 4, 6],
		excludedDates: getReadingWeek(2025, 2, 17, 21)
	},
	{
		name: 'Summer 2025',
		startDate: [2025, 5, 5],
		endDate: [2025, 8, 5],
		excludedDates: getReadingWeek(2025, 6, 16, 20)
	}
];

export const classes: Writable<Class[]> = writable([] as Class[]);

export const activeCell = writable({} as { uid: string; field: string });

export const semesterPresets: Readable<Semester[]> = readable(semesters);

export const selectedSemester: Writable<Semester> = writable({
	name: semesters[0].name,
	startDate: semesters[0].startDate,
	endDate: semesters[0].endDate,
	excludedDates: semesters[0].excludedDates
});
