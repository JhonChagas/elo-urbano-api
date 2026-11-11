
const { Router } = require('express');
const ClienteRepository = require('../repositories/ClienteRepository');
const AuthRepository = require('../repositories/AuthRepository');
const ClienteService = require('../services/ClienteService');
const ClienteController = require('../controllers/ClienteController');

const clienteRepository = new ClienteRepository();
const authRepository = new AuthRepository();
const clienteService = new ClienteService(clienteRepository, authRepository);
const clienteController = new ClienteController(clienteService);

const router = Router();
router.post('/', clienteController.cadastrar);

module.exports = router;
