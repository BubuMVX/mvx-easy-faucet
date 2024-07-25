import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'
import {ViteImageOptimizer} from "vite-plugin-image-optimizer";
import {nodePolyfills} from "vite-plugin-node-polyfills"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        ViteImageOptimizer(),
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
        })
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: () => {
                    return 'app';
                },
            },
        },
    },
})
