const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        'sm': '0.825rem'
      },

      colors: {
        gray: colors.coolGray
      },

      boxShadow: {
        emboss: '0 1px 0 0 white',
        inner: 'inset 0 1px 3px 0 rgba(0,0,0,0.10)'
      },

      container: {
        screens: {
          ms: '100%',
          md: '100%',
          lg: '100%',
          xl: '960px',
        }
      }
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [

  ],
}
