// ===========================================================
// 2. MODEL DE CLIENTE
// Representa o cliente (consumidor) e valida o FORMATO dos dados.
// Regras de negócio (idade mínima, CPF duplicado...) ficam no Service.
// A senha NUNCA entra aqui: quem guarda a senha é o Firebase Auth.
// ===========================================================
const {
  somenteDigitos, cpfValido, emailValido, dataValida, ESTADOS,
} = require('../utils/validadores');

class Cliente {
  constructor(dados = {}) {
    this.uid = dados.uid || null; // id gerado pelo Firebase Auth
    this.nomeCompleto = String(dados.nomeCompleto || '').trim();
    this.cpf = dados.cpf ? somenteDigitos(dados.cpf) : null; // opcional
    this.dataNascimento = String(dados.dataNascimento || '').trim();
    this.email = String(dados.email || '').trim().toLowerCase();
    this.telefone = somenteDigitos(dados.telefone);
    this.cep = somenteDigitos(dados.cep);
    this.cidade = String(dados.cidade || '').trim();
    this.estado = String(dados.estado || '').trim().toUpperCase();
    this.latitude = Cliente.paraNumero(dados.latitude);
    this.longitude = Cliente.paraNumero(dados.longitude);
  }

  static paraNumero(valor) {
    if (valor === undefined || valor === null || valor === '') return null;
    const n = Number(valor);
    return Number.isFinite(n) ? n : NaN;
  }

  // Devolve uma lista de erros (vazia = tudo certo)
  validar() {
    const erros = [];

    if (this.nomeCompleto.split(/\s+/).length < 2) {
      erros.push('Informe o nome completo (nome e sobrenome).');
    }
    if (this.cpf && !cpfValido(this.cpf)) erros.push('CPF inválido.');
    if (!dataValida(this.dataNascimento)) erros.push('Data de nascimento inválida.');
    if (!emailValido(this.email)) erros.push('E-mail inválido.');
    if (![10, 11].includes(this.telefone.length)) {
      erros.push('Telefone inválido (informe DDD + número).');
    }
    if (this.cep.length !== 8) erros.push('CEP inválido.');
    if (!this.cidade) erros.push('Cidade é obrigatória.');
    if (!ESTADOS.includes(this.estado)) erros.push('Estado (UF) inválido.');

    const temLat = this.latitude !== null;
    const temLng = this.longitude !== null;
    if (temLat !== temLng) {
      erros.push('Latitude e longitude devem ser enviadas juntas.');
    } else if (temLat) {
      if (!(this.latitude >= -90 && this.latitude <= 90)) erros.push('Latitude inválida.');
      if (!(this.longitude >= -180 && this.longitude <= 180)) erros.push('Longitude inválida.');
    }

    return erros;
  }

  // O que é gravado no Firestore (sem senha, sem uid: o uid é o ID do documento)
  paraFirestore() {
    return {
      nomeCompleto: this.nomeCompleto,
      cpf: this.cpf,
      dataNascimento: this.dataNascimento,
      email: this.email,
      telefone: this.telefone,
      cep: this.cep,
      cidade: this.cidade,
      estado: this.estado,
      localizacao:
        this.latitude !== null
          ? { latitude: this.latitude, longitude: this.longitude }
          : null,
    };
  }

  // O que a API devolve ao front-end (dados sensíveis como CPF ficam de fora)
  paraResposta() {
    return {
      uid: this.uid,
      nomeCompleto: this.nomeCompleto,
      email: this.email,
      cidade: this.cidade,
      estado: this.estado,
    };
  }
}

module.exports = Cliente;
