import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: '#0a5c2e', 2: '#0d7a3e', 3: '#e8f5ed' },
        gold: { DEFAULT: '#c9931a', 2: '#f0b429', 3: '#fef8e7' },
        charcoal: '#1a1a1a',
        cream: '#f9f6f0',
        muted: '#6b7280',
        border: 'rgba(0,0,0,0.08)',
      },
      fontFamily: {
        head: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-dmsans)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        pill: '100px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.04)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
