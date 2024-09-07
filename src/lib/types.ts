export type Class = {
	[key: string]: any;
	name: string;
	days: Days[];

	// Why time as a string? For svelte store data binding purposes, since <input type="time"> returns a 24hr string
	startTime: string;
	endTime: string;

	timeslot: Timeslot;
	location: string;
	uid: string;
	removed?: boolean;
	editableCol?: string;
};

export type Days = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa';

export type Timeslot = {
	start: {
		hour: number;
		minute: number;
	};
	end: {
		hour: number;
		minute: number;
	};
	toString: () => string;
};

export const createTimeslot = (text: string[]): string[] => {
	const parseTime = (time: string) => {
		let [hour, minute] = time.split(':').map((n) => parseInt(n));
		if (time.toLowerCase().includes('pm') && hour !== 12) hour += 12;
		if (time.toLowerCase().includes('am') && hour === 12) hour = 0;
		return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
	};

	const formatTime = (time: { hour: number; minute: number }): string => {
		const hour = time.hour % 12 || 12;
		const minute = time.minute.toString().padStart(2, '0');
		const period = time.hour < 12 ? 'AM' : 'PM';
		return `${hour}:${minute} ${period}`;
	};
	return text.map(parseTime);

	// return {
	// 	start,
	// 	end,
	// 	toString() {
	// 		return `${formatTime(this.start)} - ${formatTime(this.end)}`;
	// 	}
	// };
};

export enum DaysFull {
	Su = 'Sunday',
	Mo = 'Monday',
	Tu = 'Tuesday',
	We = 'Wednesday',
	Th = 'Thursday',
	Fr = 'Friday',
	Sa = 'Saturday'
}
