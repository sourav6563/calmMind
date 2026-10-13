/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        zen: {
          cream: '#F7F5EE',
          creamDark: '#EFECE3',
          card: '#FFFFFF',
          border: '#EAE6DB',
          sage: '#4E7158',
          sageHover: '#42624B',
          sageSoft: '#E4ECE5',
          charcoal: '#222522',
          muted: '#6B7068',
          dim: '#9BA098',
          badge: {
            sage: '#E4ECE5',
            sageFg: '#4E7158',
            cyan: '#E0EEF1',
            cyanFg: '#3D7886',
            blue: '#E2EBF5',
            blueFg: '#42709E',
            lavender: '#EFE7F6',
            lavenderFg: '#76569B',
            peach: '#F9EBE0',
            peachFg: '#B36D48',
            blush: '#FCE6E6',
            blushFg: '#BA4C52',
          },
        },
      },
      borderRadius: {
        radius: 'var(--radius)',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
