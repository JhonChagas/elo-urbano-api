// Erro "esperado" da aplicação (validação, conflito, etc.)
// Carrega o código HTTP que o controller deve devolver.
class AppError extends Error {
  constructor(mensagem, statusCode = 400, detalhes = null) {
    super(mensagem);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.detalhes = detalhes;
  }
}

module.exports = AppError;
