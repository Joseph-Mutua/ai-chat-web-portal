/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          DEFAULT: '#006C67',
          80: '#006C67CC',
          50: '#006C6780',
          30: '#006C674D',
          light: '#E9F7F6',
        },
        secondary: {
          DEFAULT: '#531CB3',
          80: '#531CB3CC',
          50: '#531CB380',
          30: '#531CB34D',
          lighter: '#F6F0F9',
          light: '#EDE2FF',
          medium: '#CEB8F2',
        },
        error: '#BE1E2D',
        background: '#F4F5FA',
        grey: {
          DEFAULT: '#827F85',
          light: '#EBEBEB',
        },
        text: {
          DEFAULT: '#1E1E1E',
          secondary: '#6B6B6B',
        },
        // Additional brand colors
        green: {
          DEFAULT: '#006C67',
          emerald: '#50C878',
          medium: '#4CAF50',
          light: '#94E8B4',
        },
        purple: {
          50: '#F6F1FA',
          100: '#F6F0F9',
          200: '#EDE2FF',
          300: '#7B7B9B',
          500: '#531CB3',
          900: '#2F2F4B',
        },
        darkBlue: '#2F2F4B',
        gold: {
          DEFAULT: '#FCCF1D',
          light: '#FEF2C3',
        },
        border: {
          light: '#E2E2E2',
          grey: '#D7DBE6',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0px 2px 8px rgba(224, 227, 235, 0.16)',
      },
    },
  },
  plugins: [],
}
