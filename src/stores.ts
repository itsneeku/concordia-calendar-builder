import { writable } from 'svelte/store';
import type { Class } from '$lib/ics';

export const classes = writable([] as Class[]);
