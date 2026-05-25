/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#030712',
          900: '#0b0f19',
          800: '#111827',
          700: '#1f2937',
          600: '#374151',
        },
        brand: {
          teal: '#00f2fe',
          purple: '#8a2be2',
          magenta: '#ff007f',
          green: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 8px 32px 0 rgba(0, 242, 254, 0.15)',
        'glass-purple': '0 8px 32px 0 rgba(138, 43, 226, 0.15)',
      },
      borderWidth: {
        'glass': '1px',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(0, 242, 254, 0.2), 0 0 10px rgba(0, 242, 254, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(0, 242, 254, 0.6), 0 0 25px rgba(0, 242, 254, 0.3)' },
        }
      }
    },
  },
  plugins: [],
}
