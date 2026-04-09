import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}",
    "./src/modules/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        text: {
          DEFAULT: "var(--color-foreground)",
          strong: "var(--color-foreground-strong)",
          muted: "var(--color-foreground-muted)",
          soft: "var(--color-foreground-soft)",
        },
        card: "var(--color-card)",
        surface: {
          muted: "var(--color-surface-muted)",
          neutral: "var(--color-surface-neutral)",
        },
        border: "var(--color-border)",
        outline: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        muted: "var(--color-foreground-muted)",
        gestor: {
          DEFAULT: "var(--color-gestor)",
          dark: "var(--color-gestor-dark)",
          soft: "var(--color-gestor-soft)",
          outline: "var(--color-gestor-outline)",
        },
        tecnico: {
          DEFAULT: "var(--color-tecnico)",
          dark: "var(--color-tecnico-dark)",
          soft: "var(--color-tecnico-soft)",
          outline: "var(--color-tecnico-outline)",
        },
        info: "var(--color-info)",
        warning: "var(--color-warning)",
        success: "var(--color-success)",
        danger: {
          DEFAULT: "var(--color-danger)",
          soft: "var(--color-danger-soft)",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
        button: "var(--shadow-button)",
        hero: "var(--shadow-hero)",
      },
      borderRadius: {
        panel: "var(--radius-panel)",
        "panel-lg": "var(--radius-panel-lg)",
        cta: "var(--radius-cta)",
        field: "var(--radius-field)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
      },
      fontSize: {
        "hero-title": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "600" }],
        "screen-title": ["3rem", { lineHeight: "1.08", letterSpacing: "-0.04em", fontWeight: "600" }],
        "section-title": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "600" }],
        "card-title": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.03em", fontWeight: "600" }],
        "metric-value": ["3rem", { lineHeight: "1", letterSpacing: "-0.04em", fontWeight: "600" }],
        label: ["1.375rem", { lineHeight: "1.35", letterSpacing: "-0.02em", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};

export default config;