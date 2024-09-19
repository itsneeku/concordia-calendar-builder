import { campuses, type Course, days } from '$lib';
import { nanoid } from 'nanoid';

const courseRegex = /^[A-Za-z]{3,4} \d{3,4}/;
const componentRegex = /\(.*\)/;

export const parseInput = (input: string): Course[] => {
	const courses: Course[] = [];
	let currentCourse: Partial<Course> = {};
	let componentParsed = false; // LEC/TUT/LAB
	for (let line of input.split('\n')) {
		line = normalize(line);
		try {
			if (days.some((day) => line.startsWith(day))) {
				currentCourse.days = line.split(' ')[0].split(/(?=[A-Z])/);
				[currentCourse.startTime, currentCourse.endTime] = convertTo24Hour(
					line.substring(line.search(/\d/)).split('-')
				);
			} else if (campuses.some((campus) => line.endsWith(campus))) {
				currentCourse.location = line;
			} else if (courseRegex.test(line)) {
				currentCourse.name = line.split('-')[0];
			} else if (componentRegex.test(line)) {
				currentCourse.name += ` ${line.split(' ')[0]}`;
				componentParsed = true;
			}
		} catch (err) {
			console.error('Error parsing line:', line, '\n', err);
			continue;
		}
		if (isCourseFullyPopulated(currentCourse) && componentParsed) {
			courses.push({ ...currentCourse, uid: `${nanoid()}@concordiaCalendar.neeku.dev` });
			currentCourse = {};
			componentParsed = false;
		}
	}
	return courses;
};

export const isCourseFullyPopulated = (cls: Partial<Course>): cls is Course => {
	return Boolean(cls.name && cls.location && cls.days && cls.startTime && cls.endTime);
};

const normalize = (text: string): string => {
	return text
		.replace(/(Schedule|Class|Deadlines)/, '')
		.replace(/\s+/g, ' ')
		.trim();
};

const convertTo24Hour = (times: string[]): string[] => {
	return times.map((time) => {
		const [hour, minute] = time.trim().slice(0, -2).split(':');
		const period = time.trim().slice(-2).toUpperCase();

		let hour24 = parseInt(hour);
		if (period === 'PM' && hour24 !== 12) hour24 += 12;
		if (period === 'AM' && hour24 === 12) hour24 = 0;

		return `${hour24.toString().padStart(2, '0')}:${minute}`;
	});
};
