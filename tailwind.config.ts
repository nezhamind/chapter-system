import type { Config } from "tailwindcss";

const c = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: c("border"),
        input: c("border"),
        background: c("background"),
        foreground: c("foreground"),
        primary: { DEFAULT: c("primary"), foreground: c("primary-foreground") },
        muted: { DEFAULT: c("muted"), foreground: c("muted-foreground") },
        card: { DEFAULT: c("card"), foreground: c("card-foreground") },
        destructive: { DEFAULT: c("destructive"), foreground: c("destructive-foreground") },
      },
      borderRadius: { lg: "0.625rem", md: "0.5rem", sm: "0.375rem" },
    },
  },
  plugins: [],
};

export default config;
