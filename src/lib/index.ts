import holidays from '$lib/holidays.json';
import semesters from '$lib/semesters.json';
import { CalendarDateTime } from '@internationalized/date';

const semestersData: Semesters = semesters;
const holidaysData: Holidays = holidays;
const uniDateZero = new CalendarDateTime(2007, 12, 31);

const dateToCalendarDateTime = (date: string): CalendarDateTime => {
	const [day, month, year] = date.split('/').map(Number);
	return new CalendarDateTime(year, month, day);
};

type Holidays = {
	[key: string]: string;
};

type Semesters = {
	[key: string]: {
		startDate: string;
		endDate: string;
	};
};

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
	excludedDates: CalendarDateTime[];
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
export const presetSemesters: Semester[] = Object.keys(semestersData).map((semester) => ({
	name: semester,
	startDate: dateToCalendarDateTime(semestersData[semester].startDate),
	endDate: dateToCalendarDateTime(semestersData[semester].endDate),
	excludedDates: Object.keys(holidaysData).map((date) => uniDateZero.add({ days: Number(date) }))
}));
