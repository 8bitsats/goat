import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            animation: {
                'glow-purple': 'glow-purple 4s ease-in-out infinite alternate',
                'glow-blue': 'glow-blue 5s ease-in-out infinite alternate',
                'glow-orange': 'glow-orange 6s ease-in-out infinite alternate',
                'float': 'float 8s ease-in-out infinite',
            },
            backgroundImage: {
                'glow-gradient': 'radial-gradient(circle at center, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1), rgba(249, 115, 22, 0.1), transparent)',
            },
            keyframes: {
                'glow-purple': {
                    '0%': { 'box-shadow': '0 0 30px 15px rgba(147, 51, 234, 0.3)', transform: 'scale(0.95)' },
                    '100%': { 'box-shadow': '0 0 50px 25px rgba(147, 51, 234, 0.5)', transform: 'scale(1.05)' },
                },
                'glow-blue': {
                    '0%': { 'box-shadow': '0 0 30px 15px rgba(59, 130, 246, 0.3)', transform: 'scale(1.05)' },
                    '100%': { 'box-shadow': '0 0 50px 25px rgba(59, 130, 246, 0.5)', transform: 'scale(0.95)' },
                },
                'glow-orange': {
                    '0%': { 'box-shadow': '0 0 30px 15px rgba(249, 115, 22, 0.3)', transform: 'scale(1)' },
                    '100%': { 'box-shadow': '0 0 50px 25px rgba(249, 115, 22, 0.5)', transform: 'scale(1.1)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
