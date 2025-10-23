import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import scoresRouter from './routes/scores.js';
import './db/migrate.js';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api/admin', scoresRouter);
app.use(express.static(path.join(__dirname, '../public')));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
