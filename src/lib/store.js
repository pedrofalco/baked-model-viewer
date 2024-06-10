// src/lib/store.js
import { writable } from 'svelte/store';

export const isChecked = writable(true);
export const files = writable([]);