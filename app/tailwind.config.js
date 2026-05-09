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
                surface: {
                    app: '#F8FAFC',
                    card: '#FFFFFF',
                    muted: '#F1F5F9',
                    line: '#E5E7EB',
                },
                section: {
                    news: '#4F46E5',
                    vitrine: '#D97706',
                    merchants: '#059669',
                    ads: '#EA580C',
                    campaigns: '#E11D48',
                },
            },
            spacing: {
                'safe-bottom': 'env(safe-area-inset-bottom)',
            },
            maxWidth: {
                mobile: '480px',
                shell: '520px',
            },
            borderRadius: {
                card: '16px',
                'card-lg': '20px',
                modal: '24px',
                pill: '9999px',
            },
            boxShadow: {
                card: '0 1px 3px rgba(15,23,42,0.07), 0 1px 2px rgba(15,23,42,0.04)',
                'card-hover': '0 8px 24px rgba(15,23,42,0.10)',
                soft: '0 10px 30px rgba(15,23,42,0.08)',
                modal: '0 20px 60px rgba(0,0,0,0.15)',
                fab: '0 4px 20px rgba(79,70,229,0.35)',
            },
            fontSize: {
                micro: ['10px', { lineHeight: '14px', fontWeight: '600' }],
                'mobile-title': ['20px', { lineHeight: '26px', fontWeight: '800' }],
                'mobile-card': ['15px', { lineHeight: '21px', fontWeight: '700' }],
                'mobile-body': ['14px', { lineHeight: '21px' }],
            },
        },
    },
    plugins: [],
}
