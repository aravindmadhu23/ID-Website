/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}", // This tells Tailwind to look in ALL folders inside src
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}