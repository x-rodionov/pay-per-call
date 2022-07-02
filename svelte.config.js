import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import icons from 'unplugin-icons/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({
		postcss: true
	}),

	kit: {
		// default options are shown
		adapter: vercel({
			edge: false,
			external: [],
			split: false
		}),
		vite: {
			plugins: [icons({ compiler: 'svelte' })],
			define: {
				global: {}
			}
		}
	}
};

export default config;
