/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#6366F1',   // Indigo (Unchanged)
				accent: '#8B5CF6',    // Purple (Unchanged)
				secondary: '#06B6D4', // Cyan   (Unchanged)
				success: '#22C55E',   // Green  (Unchanged)
				dark: '#0F172A',      // Dark Blue (Unchanged)
				card: '#1E293B',      // Dark Slate (Unchanged)
			},
			backgroundImage: {
				'hero-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.00) 100%)',
			},
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
		},
	},
	plugins: [],
}