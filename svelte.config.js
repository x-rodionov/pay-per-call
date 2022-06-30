import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

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
		})
	}
};

export default config;
