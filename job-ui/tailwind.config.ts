import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
          secondary: "hsl(var(--accent-secondary))",
          tertiary: "hsl(var(--accent-tertiary))",
        },
        link: "hsl(var(--link))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Natural koi-inspired colors
        "koi-orange": "hsl(var(--koi-orange))",
        "koi-red": "hsl(var(--koi-red))",
        "water-teal": "hsl(var(--water-teal))",
        "lily-green": "hsl(var(--lily-green))",
        "stone-gray": "hsl(var(--stone-gray))",
        cream: "hsl(var(--cream))",
        "earth-brown": "hsl(var(--earth-brown))",
        "moss-green": "hsl(var(--moss-green))",
        surface: "hsl(var(--surface))",
        "surface-hover": "hsl(var(--surface-hover))",
        // Pure colors
        "pure-white": "hsl(var(--pure-white))",
        "pure-black": "hsl(var(--pure-black))",
        "off-white": "hsl(var(--off-white))",
        charcoal: "hsl(var(--charcoal))",
        // Alert colors
        success: "hsl(var(--alert-success))",
        error: "hsl(var(--alert-error))",
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
        // Natural animations from CSS
        "natural-glow": {
          "0%": { "box-shadow": "0 0 0 hsl(var(--accent))" },
          "100%": { "box-shadow": "0 0 20px 6px hsl(var(--accent) / 0.3)" },
        },
        "flow-move": {
          "0%, 100%": { transform: "translateX(-100%) rotate(0deg)" },
          "50%": { transform: "translateX(100%) rotate(180deg)" },
        },
        "pulse-nature": {
          "0%, 100%": { "box-shadow": "0 0 15px hsl(var(--lily-green) / 0.3)" },
          "20%": { "box-shadow": "0 0 15px hsl(var(--koi-orange) / 0.3)" },
          "40%": { "box-shadow": "0 0 15px hsl(var(--water-teal) / 0.3)" },
          "60%": { "box-shadow": "0 0 15px hsl(var(--koi-red) / 0.3)" },
          "80%": { "box-shadow": "0 0 15px hsl(var(--cream) / 0.3)" },
        },
        "koi-movement": {
          "0%, 100%": { transform: "translateX(0) translateY(0) rotate(0deg)" },
          "25%": {
            transform: "translateX(10px) translateY(-5px) rotate(2deg)",
          },
          "50%": {
            transform: "translateX(5px) translateY(10px) rotate(-1deg)",
          },
          "75%": { transform: "translateX(-5px) translateY(5px) rotate(1deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Natural animations
        "natural-glow": "natural-glow 2.5s infinite alternate",
        flow: "flow-move 4s ease-in-out infinite",
        "pulse-nature": "pulse-nature 5s infinite",
        "koi-swim": "koi-movement 8s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Natural gradients
        "koi-gradient":
          "linear-gradient(135deg, hsl(var(--koi-orange)) 0%, hsl(var(--koi-red)) 50%, hsl(var(--accent)) 100%)",
        "water-gradient":
          "linear-gradient(135deg, hsl(var(--water-teal)) 0%, hsl(var(--accent-secondary)) 100%)",
        "forest-gradient":
          "linear-gradient(135deg, hsl(var(--lily-green)) 0%, hsl(var(--primary)) 50%, hsl(var(--moss-green)) 100%)",
        "earth-gradient":
          "linear-gradient(135deg, hsl(var(--earth-brown)) 0%, hsl(var(--stone-gray)) 50%, hsl(var(--cream)) 100%)",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
