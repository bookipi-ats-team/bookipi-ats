/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          focus: '#93C5FD',
        },
        sidebar: '#F7F8FB',
        border: '#E5E7EB',
        text: {
          primary: '#111827',
          secondary: '#4B5563',
        },
        status: {
          info: { dot: '#3B82F6', bg: '#E8F1FF' },
          read: { dot: '#8B5CF6', bg: '#F3E8FF' },
          paid: { dot: '#16A34A', bg: '#E7F6EC' },
          overdue: { dot: '#DC2626', bg: '#FDECEC' },
          ai: { dot: '#F59E0B', bg: '#FEF3C7' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '12px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
