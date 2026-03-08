/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Dark navy background system
        bg: {
          primary: '#0A0F1E',
          secondary: '#111827',
          card: '#1A2235',
          surface: '#1F2D42',
          elevated: '#243352',
        },
        // Brand emerald-green accent
        primary: {
          DEFAULT: '#10D9A0',
          50: '#E6FBF5',
          100: '#C1F5E5',
          200: '#7FECCC',
          300: '#3DE0B2',
          400: '#10D9A0',
          500: '#0BB882',
          600: '#089663',
          700: '#067048',
          800: '#04502F',
          900: '#022E1A',
          hover: '#0BB882',
          muted: 'rgba(16,217,160,0.12)',
        },
        // Accent for highlights
        accent: {
          gold: '#F5C542',
          violet: '#7C6FF7',
          coral: '#FF6B6B',
          sky: '#38BDF8',
        },
        // Text system
        text: {
          primary: '#F0F4FF',
          secondary: '#8B9DC3',
          muted: '#4B5F80',
          disabled: '#2D3D5A',
        },
        // Status colors
        success: '#10D9A0',
        warning: '#F5C542',
        danger: '#FF6B6B',
        info: '#38BDF8',
        // Border system
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          subtle: 'rgba(255,255,255,0.04)',
          strong: 'rgba(255,255,255,0.12)',
          primary: 'rgba(16,217,160,0.25)',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0A0F1E 0%, #111827 50%, #0F1F2E 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(26,34,53,0.9) 0%, rgba(15,22,42,0.95) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #10D9A0 0%, #0BB882 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F5C542 0%, #E8A820 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
        'gradient-mesh': 'radial-gradient(ellipse at 20% 50%, rgba(16,217,160,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(124,111,247,0.06) 0%, transparent 60%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.08)',
        'primary': '0 0 24px rgba(16,217,160,0.25), 0 4px 12px rgba(0,0,0,0.3)',
        'primary-sm': '0 0 12px rgba(16,217,160,0.2)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
        'elevated': '0 16px 48px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.92)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(16,217,160,0.2)' },
          '50%': { boxShadow: '0 0 24px rgba(16,217,160,0.4)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200px 0' },
          to: { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}
