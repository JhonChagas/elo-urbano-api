const { db } = require('../config/conn');
const { FieldValue } = require('firebase-admin/firestore');

const COLECAO = 'fornecedores';

class FornecedorRepository {

  async salvar(fornecedor) {
    await db
      .collection(COLECAO)
      .doc(fornecedor.cnpj)
      .create({
        ...fornecedor.paraFirestore(),
        criadoEm: FieldValue.serverTimestamp(),
      });
    return fornecedor.cnpj;
  }

  async buscarPorCnpj(cnpj) {
    const doc = await db.collection(COLECAO).doc(cnpj).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }
}

module.exports = FornecedorRepository;