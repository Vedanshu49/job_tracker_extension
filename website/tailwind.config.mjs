/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#6366F1',   // Indigo
				accent: '#8B5CF6',    // Purple
				secondary: '#06B6D4', // Cyan
				success: '#22C55E',   // Green
				dark: '#0F172A',      // Dark Blue
				card: '#1E293B',      // Dark Slate
			},
			backgroundImage: {
				'hero-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
			}
		},
	},
	plugins: [],
}
