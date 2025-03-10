import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
