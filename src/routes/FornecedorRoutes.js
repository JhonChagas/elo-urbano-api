const { Router } = require('express');
const FornecedorRepository = require('../repositories/FornecedorRepository');
const FornecedorService = require('../services/FornecedorService');
const FornecedorController = require('../controllers/FornecedorController');

const fornecedorRepository = new FornecedorRepository();
const fornecedorService = new FornecedorService(fornecedorRepository);
const fornecedorController = new FornecedorController(fornecedorService);

const router = Router();
router.post('/', fornecedorController.cadastrar);

module.exports = router;