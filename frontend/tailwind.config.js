/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bitbit: ['DNFBitBitv2'],
        galmuri11: ['Galmuri11'],
        galmuri11bold: ['Galmuri11-Bold'],
        galmuri14: ['Galmuri14'],
      },
      textStroke: {
        2: '2px black',
        1: '1px black',
      },
      textStroke: {
        2: '2px black',
        1: '1px black',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-stroke': {
          '-webkit-text-stroke': '2px black',
        },
        '.text-stroke1': {
          '-webkit-text-stroke': '1px black',
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
