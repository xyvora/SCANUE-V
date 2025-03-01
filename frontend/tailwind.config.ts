import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
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
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down var(--animate-accordion-down)",
        "accordion-up": "accordion-up var(--animate-accordion-up)",
        "fade-in": "fadeIn var(--page-enter-duration) cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-out": "fadeOut var(--page-exit-duration) cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-up": "slideUp var(--content-enter-duration) cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-from-right": "slideInFromRight var(--content-enter-duration) cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-in-from-left": "slideInFromLeft var(--content-enter-duration) cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      transitionTimingFunction: {
        "ease-spring": "cubic-bezier(0.22, 1, 0.36, 1)",
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "450": "450ms",
      },
      screens: {
        "xs": "480px",
        ...defaultTheme.screens,
        "3xl": "1920px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
        },
      },
    },
  },
  plugins: [
    typography,
    animate,
  ],
};

export default config;
