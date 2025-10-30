import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		// Ensure environment variables are passed to client
		define: {
			'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://mihari-temp.yeongmin.net'),
		},
	},
	server: {
		compatibilityDate: "2024-09-19",
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
			// Wrangler configuration (equivalent to wrangler.toml)
			wrangler: {
				vars: {
					VITE_API_URL: "https://mihari-temp.yeongmin.net",
				},
			},
		},
	},
});
