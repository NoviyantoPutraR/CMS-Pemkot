import designSystem from './Design.json'

const tokens = designSystem.designSystem

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors from Design.json
        'primary-blue': {
          DEFAULT: tokens.colorPalette.primary.blue, // #0052FF
        },
        'secondary-yellow': {
          DEFAULT: tokens.colorPalette.secondary.yellow, // #FFD700
        },
        neutral: {
          white: tokens.colorPalette.neutral.white, // #FFFFFF
          lightGray: tokens.colorPalette.neutral.lightGray, // #F5F5F5
          darkGray: tokens.colorPalette.neutral.darkGray, // #333333
          // Legacy support
          gray50: tokens.colorPalette.neutral.lightGray,
          gray100: '#E5E5E5',
          gray200: '#CCCCCC',
          gray600: '#666666',
          gray900: tokens.colorPalette.neutral.darkGray,
        },
        // Shadcn UI colors (keep for compatibility)
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },
      spacing: {
        // Default spacing values (Design.json doesn't have specific spacing values)
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '5rem',
      },
      fontSize: {
        // Typography from Design.json - using default values since structure is different
        hero: ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }], // Large, bold, uppercase
        h1: ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }], // Bold to Semi-bold
        h2: ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['1rem', { lineHeight: '1.5', fontWeight: '400' }], // Regular
        small: ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        caption: ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
        // Legacy support
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // From Design.json: Rounded corners (8-12px) for cards, rounded/pill-shaped for buttons
        card: '0.75rem', // 12px - rounded corners for cards
        'card-highlighted': '1rem', // 16px
        button: '9999px', // Pill-shaped for buttons
        search: '9999px', // Pill-shaped for search
        badge: '9999px', // Small rounded pill shapes
      },
      boxShadow: {
        // From Design.json: Soft drop shadow for cards, subtle shadow for buttons
        card: '0 2px 8px rgba(0, 0, 0, 0.1)', // Soft drop shadow
        'card-highlighted': '0 4px 16px rgba(0, 0, 0, 0.15)', // Enhanced shadow
        search: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      maxWidth: {
        // Container-based with full-width colored sections
        container: '1280px', // Standard container max width
      },
      transitionDuration: {
        default: '300ms',
        fast: '150ms',
        slow: '500ms',
      },
      transitionTimingFunction: {
        default: 'ease',
      },
    },
  },
  plugins: [],
}

