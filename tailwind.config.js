/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        glass: {
          primary: 'rgba(255, 255, 255, 0.1)',
          secondary: 'rgba(255, 255, 255, 0.05)',
          tertiary: 'rgba(255, 255, 255, 0.02)',
          border: 'rgba(255, 255, 255, 0.2)',
        },
        grade: {
          excellent: '#4CAF50',
          good: '#8BC34A',
          satisfactory: '#FF9800',
          sufficient: '#FF5722',
          poor: '#F44336',
          insufficient: '#9C27B0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
