import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// pages: 'build',
			// assets: 'build',
			// fallback: '404.html'
			//1 precompress: false,
			// strict: true
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	},
	compilerOptions: {
		runes: true
	},
	vitePlugin: {
		dynamicCompileOptions({ filename }) {
			if (filename.includes('node_modules') || filename.includes('components/ui')) {
				return {
					runes: false
				};
			}
		}
	}
};

export default config;
