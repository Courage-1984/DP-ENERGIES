/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./*.{html,js}"],
    theme: {
        extend: {
            colors: {
                'dp-navy': '#0C2D48',
                'dp-orange': '#FF6A13',
                'dp-yellow-orange': '#FFB347',
                'dp-light-gray': '#F5F6FA',
                'dp-charcoal': '#273043'
            },
            fontFamily: {
                'display': ['Playfair Display', 'Playfair-fallback', 'Georgia', 'serif'],
                'body': ['Inter', 'Inter-fallback', 'Arial', 'sans-serif']
            }
        },
    },
    plugins: [],
}
