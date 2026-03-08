/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F172A',
          800: '#1e293b',
          700: '#334155',
        },
        slate: {
          900: '#020617',
          800: '#1E293B',
          700: '#334155',
        },
        primary: {
          DEFAULT: '#15803D', // Green for Paid
          hover: '#166534',
        },
        danger: {
          DEFAULT: '#EF4444', // Red for Overdue
          light: '#F87171',
        },
        warning: {
          DEFAULT: '#F97316', // Orange for Waiting
        },
        success: {
          DEFAULT: '#10B981', // Emerald for partial/other success
        }
      },
      animation: {
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.7' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
