import { fade, slide } from 'svelte/transition';

const dur = 300;

export const customFadeOut = (node: Element) => fade(node, { duration: dur });

export const customFadeIn = (node: Element) => fade(node, { duration: dur, delay: dur });

export const customSlideOut = (node: Element) => slide(node, { duration: dur });

export const customSlideIn = (node: Element) => slide(node, { duration: dur, delay: dur });

export const customSlideInstantIn = (node: Element) => slide(node, { duration: dur });
