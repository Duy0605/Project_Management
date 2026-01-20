/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    safelist: [
        "bg-gradient-to-br",
        "from-blue-500",
        "to-blue-700",
        "from-green-500",
        "to-green-700",
        "from-red-500",
        "to-red-700",
        "from-orange-500",
        "to-orange-700",
        "from-yellow-500",
        "to-yellow-700",
        "from-purple-500",
        "to-purple-700",
        "from-amber-600",
        "to-amber-800",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
