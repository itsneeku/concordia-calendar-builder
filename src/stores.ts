import { writable } from 'svelte/store';
import type { Class } from '$lib/ics';
import testClasses from '$lib/testClasses.json';

export const classes = writable(testClasses as Class[]);
// export const classes = writable([] as Class[]);

export const editableCell = writable({} as { rowId: string; cellId: string });
