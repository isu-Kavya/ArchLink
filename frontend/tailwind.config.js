/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#050810', // Deepest matte dark
        'card-bg': '#0f172a', // Lighter dark for cards
        primary: '#ffffff', // Primary text
        secondary: '#94a3b8', // Secondary text (slate-400)
        accent: '#fff44e', // Yellow
        'accent-hover': '#facc15', // Darker yellow for gradient
        'icon-blue': '#3b82f6', // Bright Blue
      },
      animation: {
        'bounce-slow': 'bounce 4s infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 244, 78, 0.4)' },
          '50%': { boxShadow: '0 0 20px 0 rgba(255, 244, 78, 0.7)' },
        }
      }
    },
  },
  plugins: [],
}