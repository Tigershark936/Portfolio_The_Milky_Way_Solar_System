import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_SOLAR_SYSTEM_API_KEY || '';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/solar-system': {
          target: 'https://api.le-systeme-solaire.net',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/solar-system/, ''),
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // Ajouter la clé API dans les headers depuis les variables d'environnement
              if (apiKey) {
                proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
              } else {
                console.warn('⚠️ VITE_SOLAR_SYSTEM_API_KEY non définie. Créez un fichier .env.local avec votre clé API.');
              }
              proxyReq.setHeader('Accept', 'application/json');

              // Logger pour debug (seulement en dev)
              if (process.env.NODE_ENV === 'development' && req.url) {
                console.log('🔍 Proxy req URL:', req.url);
                console.log('🔍 Proxy req path:', req.url);
              }
            });
          },
        },
      },
    },
  };
})
