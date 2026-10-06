import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const DATA_DIR = path.resolve(__dirname, 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'portfolio_cloud.json');

// Garante que o diretório de dados existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Cache em memória para respostas instantâneas
let portfolioCache: any = null;
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    portfolioCache = JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler arquivo inicial de dados do portfolio:', e);
  }
}

async function startServer() {
  const app = express();

  // Permite payloads de até 50MB (para cobrir capas em base64 e múltiplos projetos)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Rota GET para obter os dados do portfólio sincronizados na nuvem do servidor
  app.get('/api/portfolio', (req, res) => {
    if (portfolioCache) {
      return res.json({ success: true, data: portfolioCache });
    }
    if (fs.existsSync(DATA_FILE)) {
      try {
        const content = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        portfolioCache = content;
        return res.json({ success: true, data: content });
      } catch (err) {
        return res.status(500).json({ success: false, error: 'Falha ao ler dados' });
      }
    }
    return res.json({ success: true, data: null });
  });

  // Rota POST para salvar alterações do portfólio (addCase, deleteCase, edições)
  app.post('/api/portfolio', (req, res) => {
    try {
      const payload = req.body;
      if (!payload || typeof payload !== 'object') {
        return res.status(400).json({ success: false, error: 'Payload inválido' });
      }

      const savedData = {
        ...payload,
        updatedAt: payload.updatedAt || new Date().toISOString(),
      };

      portfolioCache = savedData;
      fs.writeFileSync(DATA_FILE, JSON.stringify(savedData, null, 2), 'utf-8');

      return res.json({ success: true, updatedAt: savedData.updatedAt });
    } catch (err: any) {
      console.error('Erro ao salvar portfólio no servidor:', err);
      return res.status(500).json({ success: false, error: err?.message || 'Erro no servidor' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Portfolio ativo na porta ${PORT} (http://0.0.0.0:${PORT})`);
  });
}

startServer().catch((err) => {
  console.error('Erro fatal ao iniciar servidor:', err);
  process.exit(1);
});
