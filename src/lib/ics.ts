import { createEvents, type EventAttributes, type DateArray } from 'ics';
import type { FormInputEvent } from './components/ui/input';
import { nanoid } from 'nanoid';

export type Class = {
	name: string;
	component: string;
	days: string[];
	timeslot: Timeslot;
	location: string;
	uid: string;
};

export type Timeslot = {
	start: {
		hour: number;
		minute: number;
	};
	end: {
		hour: number;
		minute: number;
	};
};

const semesterStartDate: DateArray = [2024, 9, 3];
const semesterEndDate: DateArray = [2024, 12, 3];
const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const daysOfWeekFull = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday'
];
const campuses = ['SGW', 'LOY', 'TBA'];
const courseRegex = /^[A-Za-z]{3,4} \d{3,4}/; // Tests for 3-4 letters, one space, and 3-4 digits
const componentRegex = /\(.*\)/; // Test for opening and closing parantheses

export const parseInput = (text: String): Class[] => {
	const classes: Class[] = [];
	let currentClass: Class = {} as Class;
	console.log('Input:\n', text);
	for (let line of text.split('\n')) {
		line = normalize(line);
		console.log(`--------->${line}`);
		try {
			// MoWe 1:15PM - 2:30PM
			if (daysOfWeek.some((day) => line.startsWith(day))) {
				currentClass.days = line.split(' ')[0].match(new RegExp(daysOfWeek.join('|'), 'gi'))!;
				currentClass.timeslot = getTimeslot(line.substring(line.search(/\d/)).split(' - '));
			} else if (campuses.some((campus) => line.endsWith(campus))) {
				currentClass.location = line; // H 110 SGW
			} else if (courseRegex.test(line)) {
				currentClass.name = line.split('-')[0]; // COMP 228
			} else if (componentRegex.test(line)) {
				currentClass.component = line.split(' ')[0]; // LEC
			}
		} catch (err) {
			console.error('Error parsing line:', line);
			console.error(err);
			continue;
		}
		if (isClassFullyPopulated(currentClass)) {
			classes.push({ ...currentClass, uid: `${nanoid()}@concordiaCalendar.neeku.dev` });
			currentClass = {} as Class;
		}
	}
	return classes;
};

const getTimeslot = (text: string[]): Timeslot => {
	const parseTime = (time: string) => {
		let [hour, minute] = time.split(':').map((part) => parseInt(part));
		if (time.toLowerCase().includes('pm') && hour !== 12) hour += 12;
		if (time.toLowerCase().includes('am') && hour === 12) hour = 0;
		return { hour, minute };
	};

	const [start, end] = text.map(parseTime);

	return { start, end };
};

const normalize = (text: string): string => {
	return text
		.replace(/(Schedule|Class)/, '')
		.replace(/\s+/g, ' ')
		.trim();
};

export const createEventAttributes = (classes: Class[]): EventAttributes[] => {
	let events: EventAttributes[] = [];
	for (const cls of classes) {
		const event: EventAttributes = {
			title: `${cls.name} ${cls.component}`,
			start: [
				...getNextClassDate(semesterStartDate, cls.days),
				...get24HTime(cls.times[0])
			] as DateArray,
			end: [
				...getNextClassDate(semesterStartDate, cls.days),
				...get24HTime(cls.times[1])
			] as DateArray,
			location: cls.location,
			recurrenceRule: `FREQ=WEEKLY;BYDAY=${cls.days?.join().toUpperCase()};INTERVAL=1;UNTIL=${semesterEndDate[0]}${semesterEndDate[1]}0${semesterEndDate[2]}`,
			exclusionDates: getReadingWeek(2024, 10, 14, 18).map(
				(date) => [...date, ...get24HTime(cls.times[0])] as DateArray
			),
			uid: `${nanoid()}@concordiaCalendar.neeku.dev`,
			startOutputType: 'local'
		};
		events.push(event);
	}
	return events;
};

const isClassFullyPopulated = (cls: Partial<Class>): cls is Class => {
	return Boolean(cls.days && cls.timeslot && cls.location && cls.name && cls.component);
};

const getNextClassDate = (startDate: DateArray, classDays: string[]): DateArray => {
	const nextDate = new Date(startDate[0], startDate[1] - 1, startDate[2]);
	while (true) {
		const dayAbbr = daysOfWeek[nextDate.getDay()];
		if (classDays.includes(dayAbbr)) {
			return [nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate()];
		}
		nextDate.setDate(nextDate.getDate() + 1);
	}
};

const getReadingWeek = (
	year: number,
	month: number,
	startDate: number,
	endDate: number
): DateArray[] => {
	return Array.from({ length: endDate - startDate }, (_, i) => [year, month, startDate + i]);
};
