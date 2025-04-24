import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import azure from 'svelte-adapter-azure-swa';

const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: azure() }
};

export default config;
