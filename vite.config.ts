import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg';

export default defineConfig({
	plugins: [
		imagetools(),
		tailwindcss(),
		sveltekit(),
		svg({ svgoOptions: false }),
	]
});
