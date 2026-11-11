const AppError = require('../errors/AppError');

function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: `Rota não encontrada: ${req.method} ${req.originalUrl}` });

}


function errorHandler(erro, req, res, next) {
  if (erro instanceof AppError) {
    return res.status(erro.statusCode).json({
      erro: erro.message,
      detalhes: erro.detalhes,
    });
  }

  
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido.' });
  }

  
  console.error('Erro inesperado:', erro);
  res.status(500).json({ erro: 'Erro interno. Tente novamente mais tarde.' });
}

module.exports = { errorHandler, rotaNaoEncontrada };
