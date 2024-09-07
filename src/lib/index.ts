import { nanoid } from 'nanoid';
import { type Class, createTimeslot, type Days, DaysFull } from './types';
import type { DateArray, EventAttributes } from 'ics';

export const parseInput = (text: String): Class[] => {
	const classes: Class[] = [];
	let currentClass: Class = {} as Class;
	let componentFlag = false;
	for (let line of text.split('\n')) {
		line = normalize(line);
		try {
			if (Object.keys(DaysFull).some((day) => line.startsWith(day))) {
				currentClass.days = line.split(' ')[0].split(/(?=[A-Z])/) as Days[];
				// ?.map((day) => days[day as keyof typeof days]) as days[];
				[currentClass.startTime, currentClass.endTime] = createTimeslot(
					line.substring(line.search(/\d/)).split(' - ')
				);
			} else if (campuses.some((campus) => line.endsWith(campus))) {
				currentClass.location = line;
			} else if (courseRegex.test(line)) {
				currentClass.name = line.split('-')[0];
			} else if (componentRegex.test(line)) {
				currentClass.name += ` ${line.split(' ')[0]}`;
				componentFlag = true;
			}
		} catch (err) {
			console.error('Error parsing line:', line, '\n', err);
			continue;
		}
		if (isClassFullyPopulated(currentClass) && componentFlag) {
			classes.push({ ...currentClass, uid: `${nanoid()}@concordiaCalendar.neeku.dev` });
			currentClass = {} as Class;
			componentFlag = false;
		}
	}
	return classes;
};

const normalize = (text: string): string => {
	return text
		.replace(/(Schedule|Class|Deadlines)/, '')
		.replace(/\s+/g, ' ')
		.trim();
};

const isClassFullyPopulated = (cls: Partial<Class>): cls is Class => {
	return Boolean(cls.days && cls.startTime && cls.endTime && cls.location && cls.name);
};
export const getReadingWeek = (
	year: number,
	month: number,
	startDate: number,
	endDate: number
): DateArray[] => {
	return Array.from({ length: endDate - startDate }, (_, i) => [year, month, startDate + i]);
};

export const getNextClassDate = (startDate: DateArray, classDays: string[]): DateArray => {
	const nextDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
	while (true) {
		const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
			.format(nextDate)
			.slice(0, 2);
		if (classDays.includes(dayName)) {
			return [nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate()];
		}
		nextDate.setDate(nextDate.getDate() + 1);
	}
};

export const getRecurrenceRule = (days: Days[], semesterEndDate: DateArray): string =>
	`FREQ=WEEKLY;
	BYDAY=${days.map((day) => day.substring(0, 2).toUpperCase()).join()};
	INTERVAL=1;
	UNTIL=${semesterEndDate[0]}${semesterEndDate[1]}0${semesterEndDate[2]}
	`.replace(/\s/g, '');
const semesterStartDate: DateArray = [2024, 9, 3];
// new Date(Date.parse("2024-09-03 EST")); => Tue Sep 03 2024 01:00:00 GMT....
// Complete date picker component first and set date according to it (for binding purposes)
// TODO: Make everything in concordia's local time (EST), not GMT
const semesterEndDate: DateArray = [2024, 12, 3];

export const campuses = ['SGW', 'LOY', 'TBA'];
export const courseRegex = /^[A-Za-z]{3,4} \d{3,4}/;
export const componentRegex = /\(.*\)/;

export const createEventAttributes = (classes: Class[]): EventAttributes[] => {
	console.log('classes', classes);
	let events: EventAttributes[] = [];
	for (const cls of classes) {
		if (cls.removed) continue;
		const event: EventAttributes = {
			title: `${cls.name}`,
			start: [
				...getNextClassDate(semesterStartDate, cls.days),
				parseInt(cls.startTime.split(':')[0]),
				parseInt(cls.startTime.split(':')[1])
			] as DateArray,
			end: [
				...getNextClassDate(semesterStartDate, cls.days),
				parseInt(cls.endTime.split(':')[0]),
				parseInt(cls.endTime.split(':')[1])
			] as DateArray,
			location: cls.location,
			recurrenceRule: getRecurrenceRule(cls.days, semesterEndDate),
			exclusionDates: getReadingWeek(2024, 10, 14, 18).map(
				(date) =>
					[
						...date,
						parseInt(cls.startTime.split(':')[0]),
						parseInt(cls.startTime.split(':')[1])
					] as DateArray
			),
			uid: cls.uid,
			startOutputType: 'local'
		};
		events.push(event);
	}
	return events;
};
