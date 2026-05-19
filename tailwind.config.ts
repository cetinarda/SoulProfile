import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#05060f',
        bgElevated: '#0c0e22',
        panel: 'rgba(255,255,255,0.04)',
        panelBorder: 'rgba(255,255,255,0.08)',
        ink: '#f4f1ff',
        muted: 'rgba(244,241,255,0.62)',
        faint: 'rgba(244,241,255,0.35)',
        gold: '#f5d061',
        goldSoft: '#d4a94a',
        cosmic: '#7c5cff',
        cosmicDeep: '#4d2ed1',
        nebula: '#ff7ad9',
        starlight: '#9dd9ff',
        success: '#5bd9a0',
        danger: '#ff6b6b',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        galaxy: 'linear-gradient(135deg, #000010 0%, #15043a 35%, #3a0a6b 70%, #7c2ed1 100%)',
        cosmic: 'linear-gradient(135deg, #0b0524 0%, #1a0a40 50%, #3b0d6b 100%)',
        aurora: 'linear-gradient(160deg, #021131 0%, #1e1a6e 50%, #9d3cb1 100%)',
      },
      boxShadow: {
        glow: '0 10px 60px -10px rgba(124, 92, 255, 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
