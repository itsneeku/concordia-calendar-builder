import { createEvents, type EventAttributes, type DateArray } from 'ics';
import type { FormInputEvent } from './components/ui/input';
import { nanoid } from 'nanoid';

export type Class = {
	name: string;
	section: string;
	component: string;
	days: string[];
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
	times: string[];
	location: string;
};

const semesterStartDate: DateArray = [2024, 9, 3];
const semesterEndDate: DateArray = [2024, 12, 3];
const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const campuses = ['SGW', 'LOY', 'TBA'];
const courseRegex = /^[A-Za-z]{3,4} \d{3,4}$/; // Tests for 3-4 letters, one space, and 3-4 digits
const componentRegex = /\(.*\)/; // Test for opening and closing parantheses
const mobileTableRegex = /\s*(Schedule|Class)\s*/; // Tests for the word Schedule or Class that is present on the mobile student center table

export const handlePaste = (e: FormInputEvent<ClipboardEvent>): void => {
	e.preventDefault();
	if (e.clipboardData) {
		const text = e.clipboardData.getData('text');
		let classes: Class[] = parseInput(text);
		if (classes.length === 0) {
			throw new Error('No classes found, are you sure you copied the right thing?');
		}
		const events: EventAttributes[] = createEventAttributes(classes);
		createEvents(events, async (error, value) => {
			const blob = new Blob([value], { type: 'text/calendar' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'schedule.ics'; //TODO: Based on semester
			a.click();
			URL.revokeObjectURL(url);
		});
	}
};

export const parseInput = (text: String): Class[] => {
	const classes: Class[] = [];
	let currentClass: Class = {} as Class;
	console.log('Input:\n', text);
	for (let line of text.split('\n')) {
		line = line.replace(mobileTableRegex, '');
		try {
			// MoWe 1:15PM - 2:30PM
			if (daysOfWeek.some((day) => line.startsWith(day))) {
				currentClass.days = line.split(' ')[0].match(new RegExp(daysOfWeek.join('|'), 'g'))!; // ['Mo', 'We']
				currentClass.times = [line.split(' ')[1], line.split(' ')[3]]; // ['1:15PM', '2:30PM']
				// H 110 SGW
			} else if (campuses.includes(line.split(' ').at(-1)!)) {
				currentClass.location = line; // H 110 SGW
				// COMP 228-U
			} else if (courseRegex.test(line.split('-')[0])) {
				currentClass.name = line.split('-')[0]; // COMP 228
				currentClass.section = line.slice(line.indexOf('-') + 1); // U
				// LEC (1489)
			} else if (componentRegex.test(line)) {
				currentClass.component = line.split(' ')[0]; // LEC
			}
		} catch (err) {
			console.error('Error parsing line:', line);
			console.error(err);
			continue;
		}
		if (isClassFullyPopulated(currentClass)) {
			classes.push(currentClass);
			currentClass = {} as Class;
		}
	}
	return classes;
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
			recurrenceRule: `FREQ=WEEKLY;BYDAY=${cls.days?.join().toUpperCase()};INTERVAL=1;UNTIL=${semesterEndDate.join('')}`,
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
	return Boolean(cls.days && cls.times && cls.location && cls.name && cls.section && cls.component);
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

const get24HTime = (oldTime: string): [number, number] => {
	const [time, period] = oldTime.split(/(?=[AP]M)/i);
	let [hours, minutes] = time.split(':').map(Number);
	if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
	if (period.toLowerCase() === 'am' && hours === 12) hours = 0;

	return [hours, minutes];
};

const getReadingWeek = (
	year: number,
	month: number,
	startDate: number,
	endDate: number
): DateArray[] => {
	return Array.from({ length: endDate - startDate }, (_, i) => [year, month, startDate + i]);
};
