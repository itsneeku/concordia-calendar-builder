import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter()
		// paths: {
		// 	base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		// }
	},

	compilerOptions: {
		runes: true // Force runes
	},

	vitePlugin: {
		dynamicCompileOptions({ filename }) {
			// Ignore runes for Shadcn and packages
			if (filename.includes('node_modules') || filename.includes('components/ui')) {
				return {
					runes: false
				};
			}
		}
	}
};

export default config;
