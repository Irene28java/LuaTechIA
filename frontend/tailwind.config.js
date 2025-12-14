module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#abcaffff", // azul grisáceo
        black: "#000000ad"    // negro con opacidad
      },
    },
  },
  plugins: [],
}
