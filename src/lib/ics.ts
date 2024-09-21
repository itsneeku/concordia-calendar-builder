import { days, type Course, type Semester } from '$lib';
import { CalendarDateTime, getDayOfWeek } from '@internationalized/date';
import ical, { ICalEventRepeatingFreq, ICalWeekday } from 'ical-generator';
import { tzlib_get_ical_block } from 'timezones-ical-library';

const timezone = 'America/Toronto';

export const getICS = (courses: Course[], semester: Semester): string => {
	const calendar = ical().timezone({
		name: timezone,
		generator: (timezone: string) => tzlib_get_ical_block(timezone)[0]
	});

	for (const course of courses) {
		if (Object.keys(course).length === 0) continue;
		const startTime = getTimeObject(course.startTime);
		const endTime = getTimeObject(course.endTime);

		for (const range of getSplitDateRanges(
			getNextDateOfWeekDay(semester.startDate, course.days[0]),
			semester.excludedDates,
			semester.endDate
		)) {
			const firstDay = getNextDateOfWeekDay(range[0], course.days[0]);
			calendar.createEvent({
				summary: course.name,
				start: firstDay.set(startTime).toDate(timezone),
				end: firstDay.set(endTime).toDate(timezone),
				location: course.location,
				repeating: {
					freq: ICalEventRepeatingFreq.WEEKLY,
					byDay: course.days as ICalWeekday[],
					until: range[1].set(endTime).toDate(timezone)
				}
			});
		}
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

const getSplitDateRanges = (
	firstDay: CalendarDateTime,
	excludedDates: CalendarDateTime[],
	finalDay: CalendarDateTime
): [CalendarDateTime, CalendarDateTime][] => {
	const repeatingRanges = [];
	let startDate = firstDay;
	for (const excludedDate of excludedDates) {
		if (startDate.compare(excludedDate) < 0) {
			repeatingRanges.push([startDate, excludedDate.add({ days: -1 })]);
		}
		startDate = excludedDate.add({ days: 1 });
	}
	repeatingRanges.push([startDate, finalDay]);
	return repeatingRanges as [CalendarDateTime, CalendarDateTime][];
};
