/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surface tokens
        surface: '#fbf9f8',
        'surface-dim': '#dbd9d9',
        'surface-bright': '#fbf9f8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3f3',
        'surface-container': '#efeded',
        'surface-container-high': '#eae8e7',
        'surface-container-highest': '#e4e2e2',
        'surface-variant': '#e4e2e2',
        'surface-tint': '#5f5e5e',

        // On-surface tokens
        'on-surface': '#1b1c1c',
        'on-surface-variant': '#444748',
        'on-background': '#1b1c1c',
        background: '#fbf9f8',

        // Primary tokens
        primary: '#000000',
        'on-primary': '#ffffff',
        'primary-container': '#1c1b1b',
        'on-primary-container': '#858383',
        'primary-fixed': '#e5e2e1',
        'primary-fixed-dim': '#c8c6c5',
        'on-primary-fixed': '#1c1b1b',
        'on-primary-fixed-variant': '#474746',
        'inverse-primary': '#c8c6c5',
        'inverse-surface': '#303030',
        'inverse-on-surface': '#f2f0f0',

        // Secondary tokens — Champagne Gold (dark variant)
        secondary: '#775a19',
        'on-secondary': '#ffffff',
        'secondary-container': '#fed488',
        'on-secondary-container': '#785a1a',
        'secondary-fixed': '#ffdea5',
        'secondary-fixed-dim': '#e9c176',
        'on-secondary-fixed': '#261900',
        'on-secondary-fixed-variant': '#5d4201',

        // Tertiary tokens
        tertiary: '#000000',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#1a1c1c',
        'on-tertiary-container': '#838484',
        'tertiary-fixed': '#e2e2e2',
        'tertiary-fixed-dim': '#c6c6c7',
        'on-tertiary-fixed': '#1a1c1c',
        'on-tertiary-fixed-variant': '#454747',

        // Outline tokens
        outline: '#747878',
        'outline-variant': '#c4c7c7',

        // Error tokens
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        // Brand accent tokens (from DESIGN.md)
        gold: '#C5A059',             // Champagne Gold accent
        charcoal: '#1A1A1A',         // Deep Charcoal
        'marble-white': '#F9F9F9',   // Marble White
        'slate-gray': '#4A4A4A',     // Slate Gray
      },

      fontFamily: {
        'display-lg': ['"Playfair Display"', 'serif'],
        'display-lg-mobile': ['"Playfair Display"', 'serif'],
        'headline-md': ['"Playfair Display"', 'serif'],
        'headline-sm': ['"Playfair Display"', 'serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'label-caps': ['Inter', 'sans-serif'],
      },

      fontSize: {
        'display-lg': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-md': ['32px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-sm': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '1.0', letterSpacing: '0.1em', fontWeight: '600' }],
      },

      borderRadius: {
        DEFAULT: '0.25rem',   // buttons / inputs — soft, not bubbly
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',         // cards / containers
        xl: '0.75rem',
        full: '9999px',
      },

      spacing: {
        unit: '8px',
        gutter: '32px',
        'margin-desktop': '80px',
        'margin-mobile': '20px',
        'container-max': '1280px',
      },

      maxWidth: {
        'container-max': '1280px',
      },

      boxShadow: {
        'ambient': '0 8px 30px rgba(197, 160, 89, 0.08)',
        'ambient-lg': '0 12px 40px rgba(197, 160, 89, 0.12)',
        'ambient-xl': '0 20px 60px rgba(197, 160, 89, 0.15)',
        'ambient-sm': '0 4px 20px rgba(197, 160, 89, 0.06)',
        'floating': '0 8px 30px rgb(197, 160, 89, 0.12)',
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slow-pulse': {
          '0%, 100%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(1)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'slow-pulse': 'slow-pulse 8s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
