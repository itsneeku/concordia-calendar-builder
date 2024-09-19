import { days, type Course, type Semester } from '$lib';
import { CalendarDateTime, getDayOfWeek } from '@internationalized/date';
import { getVtimezoneComponent } from '@touch4it/ical-timezones';
import ical, { ICalEventRepeatingFreq, ICalWeekday } from 'ical-generator';

const timezone = 'America/Montreal';

export const getICS = (courses: Course[], semester: Semester): string => {
	const calendar = ical().timezone({
		name: timezone,
		generator: getVtimezoneComponent
	});

	for (const course of courses) {
		const firstDayOfClass = getNextDateOfWeekDay(semester.startDate, course.days[0]);
		const startTime = getTimeObject(course.startTime);
		const endTime = getTimeObject(course.endTime);

		calendar.createEvent({
			summary: course.name,
			id: course.uid,
			start: firstDayOfClass.set(startTime).toDate(timezone),
			end: firstDayOfClass.set(endTime).toDate(timezone),
			repeating: {
				freq: ICalEventRepeatingFreq.WEEKLY,
				byDay: course.days as ICalWeekday[],
				until: semester.endDate.add({ days: 1 }).toDate(timezone),
				exclude: semester.excludedDates.map((date) => date.set(startTime).toDate(timezone))
			},
			timezone: timezone
		});
	}
	return calendar.toString();
};

const getNextDateOfWeekDay = (date: CalendarDateTime, day: string): CalendarDateTime => {
	while (days[getDayOfWeek(date, 'fr-FR')] !== day) date = date.add({ days: 1 });
	return date;
};

const getTimeObject = (time: string) => {
	return Object.fromEntries(time.split(':').map((v, i) => [i ? 'minute' : 'hour', Number(v)]));
};
