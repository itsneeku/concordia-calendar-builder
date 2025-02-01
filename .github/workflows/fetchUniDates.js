import { writeFileSync } from 'fs';

const fetchUrl = async (url) => {
	try {
		const response = await fetch(url);
		return response.ok ? response : null;
	} catch (error) {
		console.error(`Error fetching ${url}:`, error);
		return null;
	}
};

const generateTerms = () => {
	const currentYear = new Date().getFullYear();
	return [currentYear - 1, currentYear].flatMap((year) =>
		[10, 20, 30, 40].map((suffix) => `1${year}${suffix}`)
	);
};

const fetchData = async () => {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

	const terms = generateTerms();
	const urls = [
		...terms.map((term) => `https://vsb.concordia.ca/api/v2/classextras/termbundle?term=${term}`),
		'https://opendata.concordia.ca/datasets/sis/CU_SR_OPEN_DATA_TERM_SESS.csv'
	];

	const responses = await Promise.all(urls.map((url) => fetchUrl(url)));

	const [termBundles, semesterCSV] = await Promise.all([
		Promise.all(
			responses.slice(0, -1).map(async (response) => (response ? response.json() : null))
		),
		responses[responses.length - 1]?.arrayBuffer()
	]);

	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
	return { termBundles, semesterCSV };
};

const parseSemestersCSV = (csvBuffer) => {
	const text = new TextDecoder('utf-16').decode(csvBuffer);
	const lines = text.split('\n').filter((line) => line.trim());
	const recentSemesters = lines.slice(-6);

	return recentSemesters.reduce((semesters, line) => {
		const [, , title, , weekCount, startDate, endDate] = line.replaceAll('"', '').split(',');
		semesters[`${title} (${weekCount})`] = { startDate, endDate };
		return semesters;
	}, {});
};

const parseHolidays = (termBundles) => {
	return termBundles
		.filter((data) => data?.holidayschedules)
		.flatMap((data) =>
			Object.values(data.holidayschedules).flatMap((schedule) => schedule.holidays)
		)
		.reduce((holidays, holiday) => ({ ...holidays, ...holiday }), {});
};

const { termBundles, semesterCSV } = await fetchData();

const holidays = parseHolidays(termBundles);
const semesters = parseSemestersCSV(semesterCSV);

writeFileSync('holidays.json', JSON.stringify(holidays, null, 2));
writeFileSync('semesters.json', JSON.stringify(semesters, null, 2));
