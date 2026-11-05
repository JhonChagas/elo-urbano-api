// ===========================================================
// 3. REPOSITORY DE CLIENTE (Firestore)
// Única camada que fala com a coleção "clientes".
// Não tem regra de negócio: só grava e busca.
// ===========================================================
const { db } = require('../config/conn');
const { FieldValue } = require('firebase-admin/firestore');

const COLECAO = 'clientes';

class ClienteRepository {
  // O ID do documento é o mesmo uid do Firebase Auth,
  // assim o login e o perfil ficam sempre ligados.
  async salvar(cliente) {
    await db
      .collection(COLECAO)
      .doc(cliente.uid)
      .set({
        ...cliente.paraFirestore(),
        criadoEm: FieldValue.serverTimestamp(),
      });
    return cliente.uid;
  }

  async buscarPorUid(uid) {
    const doc = await db.collection(COLECAO).doc(uid).get();
    return doc.exists ? { uid: doc.id, ...doc.data() } : null;
  }

  async buscarPorCpf(cpf) {
    const consulta = await db
      .collection(COLECAO)
      .where('cpf', '==', cpf)
      .limit(1)
      .get();
    return consulta.empty ? null : { uid: consulta.docs[0].id, ...consulta.docs[0].data() };
  }
}

module.exports = ClienteRepository;
