import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "svelte-adapter-bun";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess({
        style: true
    }),
    kit: {
        adapter: adapter(),
    },
};

export default config;
