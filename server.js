import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from project root with HTML extension fallback
app.use(express.static(__dirname, { extensions: ['html'] }));

// Custom 404 handler: return appropriate empty/text content for scripts/assets to prevent SyntaxError: Unexpected token '<'
app.use((req, res) => {
  const p = req.path.toLowerCase();
  if (p.endsWith('.js') || p.endsWith('.mjs')) {
    return res.status(404).type('application/javascript').send('/* 404 Not Found */');
  }
  if (p.endsWith('.json') || p.endsWith('.map')) {
    return res.status(404).type('application/json').send('{}');
  }
  if (p.endsWith('.css')) {
    return res.status(404).type('text/css').send('/* 404 Not Found */');
  }
  if (p.endsWith('.svg') || p.endsWith('.png') || p.endsWith('.jpg') || p.endsWith('.ico') || p.endsWith('.woff') || p.endsWith('.woff2')) {
    return res.status(404).end();
  }
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
