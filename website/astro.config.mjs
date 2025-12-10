import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
/** @type {import('tailwindcss').Config} */
export default defineConfig({
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

  theme: {
      extend: {
          colors: {
              primary: '#6366F1',   // Indigo (Extension Primary)
              accent: '#8B5CF6',    // Purple (Extension Accent)
              secondary: '#06B6D4', // Cyan (Extension Secondary)
              success: '#22C55E',   // Green (Extension Success)
              dark: '#0F172A',      // Dark Blue (Extension Dark Mode BG)
              card: '#1E293B',      // Dark Slate (Extension Card BG)
          },
          backgroundImage: {
              'hero-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          }
      },
	},

  plugins: [],
  integrations: [react(), tailwind()],
});