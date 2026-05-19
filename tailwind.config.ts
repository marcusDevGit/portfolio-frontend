import type { Config } from 'tailwindcss'

export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            // ─── CORES DO DESIGN SYSTEM (Stitch - Aetheric Portfolio) ───
            colors: {
                // Fundos
                background: '#141218',
                surface: {
                    DEFAULT: '#141218',
                    dim: '#141218',
                    bright: '#3b383e',
                    'container-lowest': '#0f0d13',
                    'container-low': '#1d1b20',
                    container: '#211f24',
                    'container-high': '#2b292f',
                    'container-highest': '#36343a',
                    variant: '#36343a',
                },
                // Texto
                'on-surface': '#e6e0e9',
                'on-surface-variant': '#cbc4d2',
                // Acento principal (Electric Blue / Cyan)
                primary: {
                    DEFAULT: '#00D1FF',   // Cyan — CTAs, glows
                    dim: '#cfbcff',       // Purple-ish primary do Material
                    container: '#6750a4',
                },
                // Acento secundário
                secondary: {
                    DEFAULT: '#cdc0e9',
                    container: '#4d4465',
                },
                // Acento terciário (gold)
                tertiary: {
                    DEFAULT: '#e7c365',
                    container: '#c9a74d',
                },
                // Bordas
                outline: '#948e9c',
                'outline-variant': '#494551',
                // Erro
                error: '#ffb4ab',
                // Purple glow
                aurora: {
                    blue: '#00D1FF',
                    purple: '#7000FF',
                    soft: '#cfbcff',
                },
            },

            // ─── TIPOGRAFIA ───
            fontFamily: {
                display: ['Geist', 'sans-serif'],   // Headlines
                body: ['Inter', 'sans-serif'],       // Parágrafos
                mono: ['"JetBrains Mono"', 'monospace'], // Código
            },

            fontSize: {
                'display-lg': ['64px', { lineHeight: '1.1', letterSpacing: '-0.04em', fontWeight: '700' }],
                'display-lg-mobile': ['40px', { lineHeight: '1.2', letterSpacing: '-0.03em', fontWeight: '700' }],
                'headline-md': ['32px', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '600' }],
                'body-lg': ['18px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
                'body-md': ['16px', { lineHeight: '1.6', letterSpacing: '0' }],
                'label-caps': ['12px', { lineHeight: '1.0', letterSpacing: '0.1em', fontWeight: '600' }],
                'code': ['14px', { lineHeight: '1.5' }],
            },

            // ─── BORDER RADIUS ───
            borderRadius: {
                sm: '0.25rem',
                DEFAULT: '0.5rem',
                md: '0.75rem',
                lg: '1rem',
                xl: '1.5rem',
                full: '9999px',
            },

            // ─── SPACING ───
            spacing: {
                'section-desktop': '160px',
                'section-mobile': '80px',
                'gutter': '24px',
                'container': '1200px',
            },

            // ─── MAX WIDTH ───
            maxWidth: {
                'portfolio': '1200px',
            },

            // ─── BACKDROP BLUR (glassmorphism) ───
            backdropBlur: {
                glass: '12px',
                'glass-lg': '20px',
            },

            // ─── BOX SHADOW (glows) ───
            boxShadow: {
                'glow-cyan': '0 0 20px 4px rgba(0, 209, 255, 0.25)',
                'glow-purple': '0 0 20px 4px rgba(112, 0, 255, 0.25)',
                'glow-soft': '0 0 40px 8px rgba(207, 188, 255, 0.10)',
            },
        },
    },
    plugins: [],
} satisfies Config
