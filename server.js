import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Trailing slash normalizer for non-root routes
app.use((req, res, next) => {
  if (req.path.length > 1 && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length);
    return res.redirect(301, req.path.slice(0, -1) + query);
  }
  next();
});

// Always serve core assets regardless of nested subpaths
app.get('*/magia.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'magia.js'));
});
app.get('*/styles.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'styles.css'));
});
app.get('*/patronus.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'patronus.js'));
});
app.get('*/patronus.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'patronus.css'));
});
app.get('*/js/:file', (req, res) => {
  const filePath = path.join(__dirname, 'js', req.params.file);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  res.status(404).type('application/javascript').send('/* 404 Not Found */');
});

// Serve static assets from project root with HTML extension fallback
app.use(express.static(__dirname, { extensions: ['html'] }));

// Custom 404 handler: strictly return appropriate empty/text content for scripts/assets to prevent SyntaxError: Unexpected token '<'
app.use((req, res) => {
  const p = req.path.toLowerCase();
  const accept = (req.headers.accept || '').toLowerCase();
  const dest = (req.headers['sec-fetch-dest'] || '').toLowerCase();

  // If client expects a script or module, NEVER send HTML!
  if (p.endsWith('.js') || p.endsWith('.mjs') || p.includes('.js') || dest === 'script' || accept.includes('javascript')) {
    return res.status(404).type('application/javascript').send('/* 404 Not Found */');
  }
  // If client expects JSON or data, NEVER send HTML!
  if (p.endsWith('.json') || p.endsWith('.map') || accept.includes('json') || dest === 'empty') {
    return res.status(404).type('application/json').send('{}');
  }
  if (p.endsWith('.css') || dest === 'style' || accept.includes('text/css')) {
    return res.status(404).type('text/css').send('/* 404 Not Found */');
  }
  if (p.endsWith('.svg') || p.endsWith('.png') || p.endsWith('.jpg') || p.endsWith('.ico') || p.endsWith('.woff') || p.endsWith('.woff2') || dest === 'image' || dest === 'font') {
    return res.status(404).end();
  }
  // Only send 404.html if the client explicitly accepts HTML or document navigation
  if (accept.includes('text/html') || dest === 'document') {
    return res.status(404).sendFile(path.join(__dirname, '404.html'));
  }
  // Safe default: plain text 404, NEVER HTML!
  res.status(404).type('text/plain').send('404 Not Found');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
