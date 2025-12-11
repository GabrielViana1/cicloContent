import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente. 
  // O terceiro parâmetro '' garante que carregue variáveis sem prefixo VITE_, como a API_KEY
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Substitui process.env.API_KEY pelo valor real da chave durante o build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  }
})