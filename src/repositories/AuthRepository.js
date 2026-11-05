// ===========================================================
// REPOSITORY DE AUTENTICAÇÃO (Firebase Auth)
// Isola o Firebase Auth para o Service não depender dele direto.
// A senha é guardada (com hash) pelo próprio Firebase.
// ===========================================================
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
