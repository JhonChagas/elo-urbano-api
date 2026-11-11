const Fornecedor = require('../models/Fornecedor');
const AppError = require('../errors/AppError');


const JA_EXISTE = 6;

class FornecedorService {
  constructor(fornecedorRepository) {
    this.fornecedorRepository = fornecedorRepository;
  }

  async cadastrar(dadosFormulario = {}) {
    const fornecedor = new Fornecedor(dadosFormulario);

    const erros = fornecedor.validar();
    if (erros.length) throw new AppError('Dados inválidos.', 400, erros);

    if (await this.fornecedorRepository.buscarPorCnpj(fornecedor.cnpj)) {
      throw new AppError('Já existe um fornecedor cadastrado com este CNPJ.', 409);
    }

    try {
      await this.fornecedorRepository.salvar(fornecedor);
    } catch (erro) {
      if (erro.code === JA_EXISTE) {
        throw new AppError('Já existe um fornecedor cadastrado com este CNPJ.', 409);
      }
      throw erro;
    }

    return fornecedor.paraResposta();
  }
}

module.exports = FornecedorService;