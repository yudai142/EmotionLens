import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

type DaisyUiConfig = {
  themes: Array<Record<string, Record<string, string>>>;
  darkTheme: string;
  base: boolean;
  styled: boolean;
  utils: boolean;
  logs: boolean;
};

const config: Config & { daisyui: DaisyUiConfig } = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'el-bg': '#0D1117',
        'el-card': '#161B22',
        'el-border': '#30363D',
        'el-text': '#F0F6FC',
        'el-muted': '#8B949E',
        'el-blue': '#00D4FF',
        'emotion-angry': '#FF3B3B',
        'emotion-anxious': '#FBBF24',
        'emotion-happy': '#22C55E',
        'emotion-neutral': '#00D4FF',
        'emotion-stressed': '#F97316',
        'emotion-hiding': '#A855F7',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        'emotion-dark': {
          primary: '#00D4FF',
          'primary-content': '#0D1117',
          secondary: '#A855F7',
          'secondary-content': '#F0F6FC',
          accent: '#FBBF24',
          'accent-content': '#0D1117',
          neutral: '#161B22',
          'neutral-content': '#F0F6FC',
          'base-100': '#0D1117',
          'base-200': '#161B22',
          'base-300': '#21262D',
          'base-content': '#F0F6FC',
          info: '#00D4FF',
          success: '#22C55E',
          warning: '#FBBF24',
          error: '#FF3B3B',
        },
      },
    ],
    darkTheme: 'emotion-dark',
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
};

export default config;
