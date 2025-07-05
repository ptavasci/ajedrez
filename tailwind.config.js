/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './hooks/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'night-sky': '#1a102b',
                'mountain-shadow': '#2c1e42',
                'dusk-purple': '#4c326e',
                'vibrant-violet': '#7c3aed',
                'hover-violet': '#6d28d9',
                'accent-pink': '#d946ef',
                'star-white': '#f5f0ff',
                'lavender-mist': '#c0b2d3',
                'ridge-border': '#4a3763',
            },
        },
    },
    plugins: [],
}