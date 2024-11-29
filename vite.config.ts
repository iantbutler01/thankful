import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},

	server: {
		cors: {
			origin: ['*'],
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true
		}
	},

	build: {
		target: 'esnext',
		sourcemap: true,
		rollupOptions: {
			output: {
				manualChunks: {
					'supabase': ['@supabase/supabase-js']
				}
			}
		}
	},

	optimizeDeps: {
		include: ['@supabase/supabase-js']
	},

	ssr: {
		noExternal: ['@supabase/supabase-js']
	}
});
