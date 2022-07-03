/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
    fontFamily: {
      'roboto-slab': ['Roboto Slab', 'sans-serif'],
      'roboto-mono': ['Roboto Mono', 'sans-serif']
    }
  },
  plugins: []
};
