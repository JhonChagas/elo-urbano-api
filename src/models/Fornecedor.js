const {
  somenteDigitos, somenteAlfanumericos, cnpjValido, emailValido, ESTADOS,
} = require('../utils/validadores');

// Precisa ser igual às opções do <select id="segmento"> da página
const SEGMENTOS = [
  'Alimentação e Bebidas',
  'Hortifruti e Orgânicos',
  'Artesanato e Manufaturados',
  'Serviços Gerais',
  'Moda e Vestuário',
  'Beleza e Estética',
  'Tecnologia e Reparos',
  'Saúde e Bem-estar',
  'Outro',
];

function texto(v) {
  return String(v || '').trim();
}

function paraNumero(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

class Fornecedor {
  constructor(dados = {}) {
    // --- Dados da empresa ---
    this.razaoSocial = texto(dados.razaoSocial);
    this.nomeFantasia = texto(dados.nomeFantasia);
    this.cnpj = somenteAlfanumericos(dados.cnpj);
    this.inscricaoEstadual = texto(dados.inscricaoEstadual) || null; // opcional
    this.segmento = texto(dados.segmento);

    // --- Localização ---
    this.cep = somenteDigitos(dados.cep);
    this.rua = texto(dados.rua);
    this.numero = texto(dados.numero);
    this.bairro = texto(dados.bairro);
    this.cidade = texto(dados.cidade);
    this.estado = texto(dados.estado).toUpperCase();
    this.pais = texto(dados.pais) || 'Brasil';
    this.latitude = paraNumero(dados.latitude);
    this.longitude = paraNumero(dados.longitude);

    // --- Contato ---
    this.responsavel = texto(dados.responsavel);
    this.telefone = somenteDigitos(dados.telefone);
    this.whatsapp = somenteDigitos(dados.whatsapp) || null; // opcional
    this.email = texto(dados.email).toLowerCase();
  }

  // Devolve uma lista de erros (vazia = tudo certo)
  validar() {
    const erros = [];

    if (this.razaoSocial.length < 3) erros.push('Razão social é obrigatória.');
    if (this.nomeFantasia.length < 2) erros.push('Nome fantasia é obrigatório.');
    if (!cnpjValido(this.cnpj)) erros.push('CNPJ inválido.');
    if (this.inscricaoEstadual && this.inscricaoEstadual.length > 20) {
      erros.push('Inscrição estadual inválida.');
    }
    if (!SEGMENTOS.includes(this.segmento)) erros.push('Selecione um segmento válido.');

    if (this.cep.length !== 8) erros.push('CEP inválido.');
    if (!this.rua) erros.push('Rua é obrigatória.');
    if (!this.numero) erros.push('Número é obrigatório.');
    if (!this.bairro) erros.push('Bairro é obrigatório.');
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

    if (this.responsavel.length < 3) erros.push('Nome do responsável é obrigatório.');
    if (![10, 11].includes(this.telefone.length)) {
      erros.push('Telefone inválido (informe DDD + número).');
    }
    if (this.whatsapp && ![10, 11].includes(this.whatsapp.length)) {
      erros.push('WhatsApp inválido (informe DDD + número).');
    }
    if (!emailValido(this.email)) erros.push('E-mail inválido.');

    return erros;
  }

  // O que é gravado no Firestore (o CNPJ é o ID do documento)
  paraFirestore() {
    return {
      razaoSocial: this.razaoSocial,
      nomeFantasia: this.nomeFantasia,
      cnpj: this.cnpj,
      inscricaoEstadual: this.inscricaoEstadual,
      segmento: this.segmento,
      cep: this.cep,
      rua: this.rua,
      numero: this.numero,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado,
      pais: this.pais,
      localizacao:
        this.latitude !== null
          ? { latitude: this.latitude, longitude: this.longitude }
          : null,
      responsavel: this.responsavel,
      telefone: this.telefone,
      whatsapp: this.whatsapp,
      email: this.email,
    };
  }

  // O que a API devolve ao front-end
  paraResposta() {
    return {
      id: this.cnpj,
      nomeFantasia: this.nomeFantasia,
      cidade: this.cidade,
      estado: this.estado,
    };
  }
}

Fornecedor.SEGMENTOS = SEGMENTOS;
module.exports = Fornecedor;