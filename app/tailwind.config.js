/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    500: '#6366F1',
                    600: '#4F46E5',
                    700: '#4338CA',
                },
            },
            borderRadius: {
                card: '16px',   // cards e inputs
                modal: '24px',   // modais e sheets
                pill: '9999px', // badges e botões pequenos
            },
            boxShadow: {
                card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                modal: '0 20px 60px rgba(0,0,0,0.15)',
                fab: '0 4px 20px rgba(79,70,229,0.35)',
            },
            fontSize: {
                'micro': ['10px', { lineHeight: '14px', fontWeight: '600' }],
            },
        },
    },
    plugins: [],
}
