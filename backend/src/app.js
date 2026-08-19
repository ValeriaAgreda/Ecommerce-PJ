import cors from 'cors';
import express from 'express';
import { pool } from './config/database.js';

export const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando correctamente.' });
});

app.get('/api/database', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Conexión con MySQL establecida.' });
  } catch (error) {
    next(error);
  }
});

app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada.' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Error interno del servidor.' });
});
