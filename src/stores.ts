import { writable } from 'svelte/store';
import type { Class } from '$lib/ics';
import textData from '$lib/debuggingInput.json';

export const classes = writable(textData as Class[]);
