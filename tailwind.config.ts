import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // BoaFie navy/gold brand refresh — "green"/"gold" names kept as-is
        // (every component already references them) so this file is the
        // only thing that needed to change to re-theme the whole app.
        green: { DEFAULT: '#0A3D91', 2: '#0D4BAE', 3: '#EAF1FB' },
        gold: { DEFAULT: '#F5A300', 2: '#FFB627', 3: '#FEF3E0' },
        navy: '#072C63',
        charcoal: '#2F3542',
        cream: '#F8FAFC',
        muted: '#6b7280',
        border: '#E2E8F0',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
        info: '#2563EB',
      },
      fontFamily: {
        // One rounded geometric family (Manrope) for both — weight utility
        // classes (font-semibold, font-bold, etc.) do the differentiating.
        head: ['var(--font-manrope)', 'sans-serif'],
        body: ['var(--font-manrope)', 'sans-serif'],
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
