
const Cliente = require('../models/Cliente');
const AppError = require('../errors/AppError');
const { calcularIdade } = require('../utils/validadores');

const IDADE_MINIMA = 18; // regra de negócio: ajuste se o grupo decidir outra
const TAMANHO_MINIMO_SENHA = 8;

class ClienteService {
  constructor(clienteRepository, authRepository) {
    this.clienteRepository = clienteRepository;
    this.authRepository = authRepository;
  }

  async cadastrar(dadosFormulario = {}) {
    const { senha, confirmarSenha, ...perfil } = dadosFormulario;
    const cliente = new Cliente(perfil);

    // --- Validação de formato (Model) + senha ---
    const erros = cliente.validar();
    if (typeof senha !== 'string' || senha.length < TAMANHO_MINIMO_SENHA) {
      erros.push(`A senha deve ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`);
    }
    if (senha !== confirmarSenha) erros.push('As senhas não conferem.');
    if (erros.length) throw new AppError('Dados inválidos.', 400, erros);

    // --- Regras de negócio ---
    if (calcularIdade(cliente.dataNascimento) < IDADE_MINIMA) {
      throw new AppError(`É necessário ter ${IDADE_MINIMA} anos ou mais para se cadastrar.`, 422);
    }

    if (cliente.cpf && (await this.clienteRepository.buscarPorCpf(cliente.cpf))) {
      throw new AppError('Já existe um cadastro com este CPF.', 409);
    }

    // --- Cria o login (e-mail duplicado é recusado pelo próprio Firebase) ---
    try {
      cliente.uid = await this.authRepository.criarUsuario({
        email: cliente.email,
        senha,
        nome: cliente.nomeCompleto,
      });
    } catch (erro) {
      if (erro.code === 'auth/email-already-exists') {
        throw new AppError('Já existe um cadastro com este e-mail.', 409);
      }
      if (erro.code === 'auth/invalid-email' || erro.code === 'auth/invalid-password') {
        throw new AppError('E-mail ou senha em formato inválido.', 400);
      }
      throw erro;
    }

    // --- Salva o perfil; se falhar, desfaz o login criado ---
    try {
      await this.clienteRepository.salvar(cliente);
    } catch (erro) {
      await this.authRepository.excluirUsuario(cliente.uid).catch(() => {});
      throw erro;
    }

    return cliente.paraResposta();
  }
}

module.exports = ClienteService;
