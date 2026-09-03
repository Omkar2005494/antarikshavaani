/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', "sans-serif"],
        mono: ['"JetBrains Mono"', "Fira Code", "monospace"],
        "headline-display": ['"Space Grotesk"', "sans-serif"],
        "headline-lg": ['"Space Grotesk"', "sans-serif"],
        "body-md": ['"Plus Jakarta Sans"', "sans-serif"],
        "data-mono": ['"JetBrains Mono"', "monospace"],
        "label-caps": ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        void: {
          950: '#030712',
          900: '#060b18',
          850: '#0a1024',
          800: '#0f172a',
        },
        space: {
          950: '#030712',
          900: '#060b18',
          850: '#0a1024',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        hud: {
          cyan: '#38bdf8',
          blue: '#06b6d4',
          amber: '#f59e0b',
          rose: '#f43f5e',
          emerald: '#10b981',
          saffron: '#ff9933',
        }
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
