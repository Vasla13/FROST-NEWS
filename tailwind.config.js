/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 24px 70px rgba(0,0,0,.55)",
      },
    },
  },
  plugins: [],
};
