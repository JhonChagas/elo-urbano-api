
const { auth } = require('../config/conn');

class AuthRepository {
  async criarUsuario({ email, senha, nome }) {
    const usuario = await auth.createUser({
      email,
      password: senha,
      displayName: nome,
    });
    return usuario.uid;
  }

  async excluirUsuario(uid) {
    await auth.deleteUser(uid);
  }
}

module.exports = AuthRepository;
