/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // 60% background
        bg: {
          primary: '#0A0A0B',
        },
        // 30% surface
        surface: {
          1: '#111113',
          2: '#18181B',
          3: '#1E1E23',
        },
        // 10% accent
        accent: {
          gold: '#E8C547',
          indigo: '#7C9CF5',
          mint: '#5DDCB4',
        },
        // Text
        ink: {
          primary: '#F4F4F5',
          secondary: '#A1A1AA',
          muted: '#52525B',
        },
        // Status
        verdict: {
          demonstrated: '#4ADE80',
          partial: '#FCD34D',
          missing: '#F87171',
          unable: '#93C5FD',
        },
      },
      borderColor: {
        'surface': 'rgba(255,255,255,0.06)',
        'surface-hover': 'rgba(255,255,255,0.12)',
        'accent-gold': 'rgba(232,197,71,0.25)',
      },
      boxShadow: {
        'panel': '0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)',
        'panel-hover': '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.5)',
        'glow-gold': '0 0 24px rgba(232,197,71,0.20)',
        'glow-green': '0 0 16px rgba(34,197,94,0.15)',
      },
      backgroundImage: {
        'grid-lines': `
          linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid-48': '48px 48px',
      },
      animation: {
        'slide-up': 'slide-up 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 300ms ease forwards',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(0.85)' },
        },
      },
      letterSpacing: {
        'tighter-2': '-0.02em',
        'wider-2': '0.08em',
        'widest-2': '0.12em',
      },
    },
  },
  plugins: [],
};
