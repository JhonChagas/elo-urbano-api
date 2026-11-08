class FornecedorController {
  constructor(fornecedorService) {
    this.fornecedorService = fornecedorService;
  }


  cadastrar = async (req, res, next) => {
    try {
      const fornecedor = await this.fornecedorService.cadastrar(req.body);
      res.status(201).json({
        mensagem: 'Fornecedor cadastrado com sucesso! Em breve entraremos em contato.',
        fornecedor,
      });
    } catch (erro) {
      next(erro);
    }
  };
}

module.exports = FornecedorController;