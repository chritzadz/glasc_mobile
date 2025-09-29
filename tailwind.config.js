/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                // Primary brand colors
                primary: {
                    DEFAULT: "#B87C4C", // var(--primary-color)
                    50: "#F5EDE4",
                    100: "#E9D5C1",
                    200: "#DCBC9D",
                    300: "#CFA379",
                    400: "#C28A56",
                    500: "#B87C4C", // Main brand color
                    600: "#A06B3F",
                    700: "#885A32",
                    800: "#704925",
                    900: "#583818",
                },
                secondary: {
                    DEFAULT: "#F7F4EA", // var(--secondary-color)
                    50: "#FEFDFB",
                    100: "#FEFCF8",
                    200: "#FDF9F0",
                    300: "#FCF6E8",
                    400: "#FAF5E6",
                    500: "#F7F4EA", // Main secondary color
                    600: "#F0E9D3",
                    700: "#E8DDBC",
                    800: "#E1D2A5",
                    900: "#D9C68E",
                },
                tertiary: {
                    DEFAULT: "#996032", // var(--tertiary-color)
                    50: "#F0E6DB",
                    100: "#E0CCB7",
                    200: "#D1B393",
                    300: "#C1996F",
                    400: "#B17F4B",
                    500: "#996032", // Main tertiary color
                    600: "#85542C",
                    700: "#714826",
                    800: "#5D3C20",
                    900: "#49301A",
                },
                // Semantic colors
                background: "#F7F4EA",
                surface: "#FFFFFF",
                text: {
                    primary: "#996032",
                    secondary: "#B87C4C",
                    inverse: "#F7F4EA",
                },
                border: "#B87C4C",
                accent: "#B87C4C",
            },
        },
    },
    plugins: [],
};
