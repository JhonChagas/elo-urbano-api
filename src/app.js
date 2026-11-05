const express = require('express');
const cors = require('cors');
const clienteRoutes = require('./routes/ClienteRoutes');
const { errorHandler, rotaNaoEncontrada } = require('./middlewares/errorHandler');

const app = express();

const origensPermitidas = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({ origin: origensPermitidas }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/saude', (req, res) => res.json({ status: 'ok', projeto: 'Elo Urbano' }));
app.use('/api/clientes', clienteRoutes);

app.use(rotaNaoEncontrada);
app.use(errorHandler);

module.exports = app;
