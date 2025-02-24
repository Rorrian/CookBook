import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"
import { analyzer } from 'vite-bundle-analyzer'
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		react(),
		svgr(),
		analyzer(),
	],
  resolve: {
    alias: {
			"@app": path.resolve(__dirname, "src/app"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@libs": path.resolve(__dirname, "src/libs"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@components": path.resolve(__dirname, "src/shared/components"),
      "@hooks": path.resolve(__dirname, "src/shared/hooks"),
      "@providers": path.resolve(__dirname, "src/shared/providers"),
      "@api": path.resolve(__dirname, "src/shared/providers/api"),
      "@store": path.resolve(__dirname, "src/shared/store"),
      "@utils": path.resolve(__dirname, "src/shared/utils"),
      "@types": path.resolve(__dirname, "src/types"),
    },
    preserveSymlinks: true,
  },
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
		emptyOutDir: true,
		rollupOptions: {
      output: {
        manualChunks(id) {
					if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
						return "react";
					}
					if (id.includes("node_modules/redux") ||
						id.includes("node_modules/react-redux") ||
						id.includes("node_modules/redux-persist") ||
						id.includes("node_modules/@reduxjs/toolkit/dist")
					) {
						return "redux";
					}
					if (id.includes("node_modules/@supabase")) {
						return "supabase";
					}
					if (id.includes("node_modules/@heroui/react") ||
						id.includes("node_modules/@heroui") ||
						id.includes("node_modules/@react-aria") ||
						id.includes("node_modules/framer-motion/dist")
					) {
						return "heroui";
					}

					
					if (id.includes('pages')) {
						return 'pages'; 
					}
					// if (id.includes('pages/account-recovery')) {
					// 	return 'account-recovery-page'; 
					// }
					// if (id.includes('pages/categories')) {
					// 		return 'categories-page'; 
					// }
					// if (id.includes('pages/favorites')) {
					// 		return 'favorites-page'; 
					// }
					// if (id.includes('pages/getting-started')) {
					// 		return 'getting-started-page'; 
					// }
					// if (id.includes('pages/home')) {
					// 		return 'home-page'; 
					// }
					// if (id.includes('pages/login')) {
					// 		return 'login-page'; 
					// }
					// if (id.includes('pages/recipe')) {
					// 	return 'recipe-page'; 
					// }
					// if (id.includes('pages/register')) {
					// 	return 'register-page'; 
					// }
					// if (id.includes('pages/reset-password')) {
					// 	return 'reset-password-page'; 
					// }
					// if (id.includes('pages/settings')) {
					// 	return 'settings-page'; 
					// }

					// Остальное в отдельный чанк
					if (id.includes("node_modules")) {
						return "vendor";
					}
        }
      }
    }
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
