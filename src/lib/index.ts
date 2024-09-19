import { CalendarDateTime, type DateValue } from '@internationalized/date';

export type Course = {
	[key: string]: unknown;
	uid: string;
	name: string;
	location: string;
	days: typeof days;
	startTime: string;
	endTime: string;
};

export type Semester = {
	name: string;
	startDate: CalendarDateTime;
	endDate: CalendarDateTime;
	excludedDates: DateValue[];
};

export const rangeToDates = (
	start: CalendarDateTime,
	end: CalendarDateTime
): CalendarDateTime[] => {
	const dates: CalendarDateTime[] = [];

	while (start.compare(end) <= 0) {
		dates.push(start);
		start = start.add({ days: 1 });
	}

	return dates;
};

export const days: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export const campuses = ['SGW', 'LOY', 'TBA'];
export const presetSemesters: Semester[] = [
	{
		name: 'Fall 2024',
		startDate: new CalendarDateTime(2024, 9, 2),
		endDate: new CalendarDateTime(2024, 12, 2),
		excludedDates: [
			new CalendarDateTime(2024, 9, 2), // Labour Day
			new CalendarDateTime(2024, 10, 14), // Thanksgiving
			...rangeToDates(new CalendarDateTime(2024, 10, 15), new CalendarDateTime(2024, 10, 20)) // Reading Week
		]
	},
	{
		name: 'Winter 2025',
		startDate: new CalendarDateTime(2025, 1, 13),
		endDate: new CalendarDateTime(2025, 4, 12),
		excludedDates: [
			...rangeToDates(new CalendarDateTime(2025, 1, 24), new CalendarDateTime(2025, 2, 2)) // Reading Week
		]
	}
];
