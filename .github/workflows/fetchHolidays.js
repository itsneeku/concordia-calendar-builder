import { writeFileSync } from 'fs';
async function fetchTermBundle() {
	process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

	const currentYear = new Date().getFullYear();
	const terms = [currentYear - 1, currentYear].flatMap((year) =>
		[10, 20, 30, 40].map((suffix) => `1${year}${suffix}`)
	);

	try {
		const responses = await Promise.all(
			terms.map((term) =>
				fetch(`https://vsb.concordia.ca/api/v2/classextras/termbundle?term=${term}`)
					.then((response) => (response.ok ? response.json() : null))
					.catch(() => null)
			)
		);

		const holidays = Object.assign(
			{},
			...responses
				.filter((data) => data?.holidayschedules)
				.flatMap((data) =>
					Object.values(data.holidayschedules).map((schedule) => schedule.holidays)
				)
		);

		console.log(holidays);
		return holidays;
	} catch (error) {
		return { error: error };
	} finally {
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
	}
}

const termResponses = await fetchTermBundle();

writeFileSync('holidays.json', JSON.stringify(termResponses, null, 2));
