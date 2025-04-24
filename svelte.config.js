import { preprocessMeltUI, sequence } from "@melt-ui/pp";
import azure from "svelte-adapter-azure-swa";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	compilerOptions: {
		enableSourcemap: true
	},
	preprocess: sequence([vitePreprocess({ script: true }), preprocessMeltUI()]),
	kit: {
		adapter: azure(),
		alias: {
			$static: "static"
		}
	},
};

export default config;
