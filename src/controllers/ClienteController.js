
class ClienteController {
  constructor(clienteService) {
    this.clienteService = clienteService;
  }

  // POST /api/clientes
  cadastrar = async (req, res, next) => {
    try {
      const cliente = await this.clienteService.cadastrar(req.body);
      res.status(201).json({
        mensagem: 'Conta criada com sucesso! Bem-vindo ao Elo Urbano.',
        cliente,
      });
    } catch (erro) {
      next(erro); 
    }
  };
}

module.exports = ClienteController;
