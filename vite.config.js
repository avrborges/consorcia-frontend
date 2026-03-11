import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CONSORCIA',
        short_name: 'CONSORCIA',
        description: 'Gestión moderna para tu edificio',
        start_url: '/',
        theme_color: '#0f2044',
        background_color: '#0b1530',
        display: 'standalone',   // ← esto elimina las barras del navegador
        orientation: 'portrait',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true, // Permite acceso desde la red local  
    port: 5173
  },
  build: {
    outDir: 'dist',
  },
})
