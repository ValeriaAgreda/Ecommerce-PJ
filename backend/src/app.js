import cors from 'cors';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './config/database.js';

export const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

const quoteFields = [
  ['name', 'Nombre'], ['company', 'Empresa'], ['phone', 'Teléfono'], ['email', 'Correo'],
  ['origin', 'Origen'], ['destination', 'Destino'], ['cargoType', 'Tipo de carga'],
  ['incoterm', 'Incoterm'], ['volume', 'Volumen'], ['weight', 'Peso'],
  ['estimatedDeliveryDate', 'Fecha estimada de entrega'],
];

const clean = (value) => String(value ?? '').trim();
const positiveNumber = (value) => /^\d+(?:[.,]\d+)?$/.test(value) && Number(value.replace(',', '.')) > 0;
const todayInBolivia = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/La_Paz', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());
const escapeHtml = (value) => clean(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
})[character]);

app.post('/api/quotes', async (req, res, next) => {
  try {
    const quote = Object.fromEntries(quoteFields.map(([key]) => [key, clean(req.body[key])]));
    const missingFields = quoteFields.filter(([key]) => !quote[key]).map(([, label]) => label);
    if (missingFields.length) {
      return res.status(400).json({ message: `Completa los siguientes campos: ${missingFields.join(', ')}.` });
    }
    if (!/^\S+@\S+\.\S+$/.test(quote.email)) {
      return res.status(400).json({ message: 'Ingresa un correo electrónico válido.' });
    }
    if (!/^\+?\d{7,15}$/.test(quote.phone)) {
      return res.status(400).json({ message: 'El teléfono debe tener entre 7 y 15 números; el signo + solo puede ir al inicio.' });
    }
    if (!positiveNumber(quote.volume)) {
      return res.status(400).json({ message: 'El volumen debe ser un número mayor que cero, expresado en m³.' });
    }
    if (!positiveNumber(quote.weight)) {
      return res.status(400).json({ message: 'El peso debe ser un número mayor que cero, expresado en kg.' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(quote.estimatedDeliveryDate) || quote.estimatedDeliveryDate < todayInBolivia()) {
      return res.status(400).json({ message: 'La fecha estimada de entrega no puede ser anterior a la fecha actual.' });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      throw new Error('Falta configurar SMTP_HOST, SMTP_USER o SMTP_PASS.');
    }
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 587),
      secure: Number(SMTP_PORT ?? 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    const rows = quoteFields.map(([key, label]) =>
      `<tr><th style="padding:8px 12px;text-align:left;background:#f4f6f8">${label}</th><td style="padding:8px 12px">${escapeHtml(quote[key])}</td></tr>`,
    ).join('');

    await transporter.sendMail({
      from: SMTP_FROM ?? SMTP_USER,
      to: 'info@pjservices-srl.com',
      replyTo: quote.email,
      subject: `Nueva solicitud de cotización — ${quote.company}`,
      text: quoteFields.map(([key, label]) => `${label}: ${quote[key]}`).join('\n'),
      html: `<h2>Nueva solicitud de cotización</h2><table style="border-collapse:collapse">${rows}</table>`,
    });
    return res.status(201).json({ message: 'Solicitud enviada correctamente.' });
  } catch (error) {
    return next(error);
  }
});

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

const frontendDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');
app.use(express.static(frontendDist));
app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => res.sendFile(path.join(frontendDist, 'index.html')));

app.use((_req, res) => res.status(404).json({ message: 'Ruta no encontrada.' }));
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Error interno del servidor.' });
});
