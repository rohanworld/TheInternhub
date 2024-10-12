import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './app/**/*.{ts,tsx,js,jsx}',
    './src/**/*.{ts,tsx,js,jsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    extend: {
      backgroundImage: {
        'custom-button-gradient-light': 'linear-gradient(to right, #faf8fb, #f5f4f7, #eef5f9)',
        'selected-button-gradient-light': 'linear-gradient(to right, #f4e9f1, #f1edf4, #e9f0f7)',
        'custom-gradient-light': 'linear-gradient(135deg, #f9f1f4, #f1eef6, #ebf3f8, #e6f4f4)',

        'custom-button-gradient-dark': 'linear-gradient(to right, #2b2b3a, #323743, #394853)',
        'selected-button-gradient-dark': 'linear-gradient(to right, #282832, #2e353e, #36434d)',
        'custom-gradient-dark': 'linear-gradient(135deg, #252731, #303841, #374750, #32494b)',

        'gradient-custom': 'linear-gradient(180deg, #7F5BC4 0%, #60A3E6 100%)',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: '#8777E0', // Purple
        secondary: '#60A3E6', // Blue
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        dmsans: ['var(--font-dmsans)']
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slide: {
          '0%, 25%': { transform: 'translateY(0%)' },
           '33.33%, 58.33%': { transform: 'translateY(-100%)' },
           '66.66%, 91.66%': { transform: 'translateY(-200%)' },
           '100%': { transform: 'translateY(0%)' },
         },
        smslide:{
            '0%, 25%': { transform: 'translateY(0%)' },
           '33.33%, 58.33%': { transform: 'translateY(-100%)' },
           '66.66%, 91.66%': { transform: 'translateY(-200%)' },
          //  '100%': { transform: 'translateY(0%)' },
         
        }

      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        slide: 'slide 9s infinite cubic-bezier(0.83, 0, 0.17, 1)',
        smslide:'smslide 5s infinite cubic-bezier(0.83,0, 0.17, 1)'
      },
    },
    scale: {
      '102': '1.02',
      '105': '1.05',
      '110': '1.10'
    },
    fontFamily: {
      jakarta: ["Plus Jakarta Sans", "sans-serif"],
      kumbhsans: ["Kumbh Sans", "sans-serif"],
    }
  },
  plugins: [require("tailwindcss-animate"), require('daisyui'),
    function ({ addBase, theme }: { addBase: (baseStyles: Record<string, any>) => void, theme: (path: any) => any }) {
      addBase({
        'h1, h2, h3': {
          backgroundImage: theme('backgroundImage.gradient-custom'),
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text', // Ensure compatibility with WebKit browsers
          color: 'transparent', // Set text to transparent for the gradient to show through
          fontSize: theme('fontSize.5xl'),
        },
        'p': {
          fontSize: theme('fontSize.base'),
          lineHeight: theme('lineHeight.relaxed'),
          color: theme('colors.gray.600'), // Light mode color
          '.dark &': {
            color: theme('colors.gray.300'), // Dark mode color
          },
        },

      });
    },
  ],
} satisfies Config

export default config;