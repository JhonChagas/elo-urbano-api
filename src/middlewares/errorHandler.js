const AppError = require('../errors/AppError');

function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` });

}

// Middleware de erro do Express (precisa ter 4 parâmetros)
// eslint-disable-next-line no-unused-vars
function errorHandler(erro, req, res, next) {
  if (erro instanceof AppError) {
    return res.status(erro.statusCode).json({
      erro: erro.message,
      detalhes: erro.detalhes,
    });
  }

  // JSON mal formatado no corpo da requisição
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido.' });
  }

  // Erro inesperado: registra no servidor, mas não expõe detalhes ao usuário
  console.error('Erro inesperado:', erro);
  res.status(500).json({ erro: 'Erro interno. Tente novamente mais tarde.' });
}

module.exports = { errorHandler, rotaNaoEncontrada };
