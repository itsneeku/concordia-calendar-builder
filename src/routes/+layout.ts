export const ssr = false;
export const load = ({ url }) => {
	return {
		url: url.pathname
	};
};
