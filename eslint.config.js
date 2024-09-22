import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
			ecmaVersion: 'latest'
		}
	},
	{
		files: [
			'**/*.svelte',
			'*.svelte',
			'**/*.svelte.ts',
			'*.svelte.ts',
			'**/*.svelte.js',
			'*.svelte.js',
			'**/*.{js,ts}'
		],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'src/lib/components/ui/', 'node_modules/']
	}
];
