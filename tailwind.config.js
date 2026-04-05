/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-orange': '#FF6B35',
        'primary-yellow': '#FFD23F',
        'taipei-blue': '#4A90E2',
        'tainan-orange': '#F5A623',
        'hualien-green': '#7ED321',
        'bg-cream': '#FFF9E6',
        'text-dark': '#333333',
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.08)',
        'hover': '0 4px 20px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
