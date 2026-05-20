import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        bone: "var(--bone)",
        "bone-2": "var(--bone-2)",
        "bone-3": "var(--bone-3)",
        ember: "var(--ember)",
        "ember-dim": "var(--ember-dim)",
        copper: "var(--copper)",
        "copper-dim": "var(--copper-dim)",
        fog: "var(--fog)",
      },
      fontFamily: {
        display: ["var(--display)"],
        body: ["var(--body)"],
        mono: ["var(--mono)"],
      },
      boxShadow: {
        soft: "0 20px 70px rgba(10, 10, 10, 0.08)",
        hairline: "0 1px 0 rgba(10, 10, 10, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
