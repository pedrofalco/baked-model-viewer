/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        "jet-brains-mono": ['JetBrains Mono', 'monospace'],
      },
    }
  },
  plugins: [require('daisyui')],
  };