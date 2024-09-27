/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  important: true,
  corePlugins: {
    preflight: false, // to avoid conflict with base SPFx styles otherwise (ex: buttons background-color)
  },
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "var(--color-primary-light)", // Use CSS variable for light primary color
          DEFAULT: "var(--color-primary)", // Use CSS variable for primary color
          dark: "var(--color-primary-dark)", // Use CSS variable for dark primary color
        },
        // antdDisabledBg: '#E5E4E2',
        // antdDisabledBorder: '#D3D3D3',
      },
    },
  },
  plugins: [],
};
