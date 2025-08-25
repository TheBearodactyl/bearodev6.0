import adapter from "svelte-adapter-bun";
import { sveltePreprocess } from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: sveltePreprocess({
        scss: true,
    }),
    kit: {
        adapter: adapter(),
    },
};

export default config;
