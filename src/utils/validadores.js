function somenteDigitos(valor) {
  return String(valor || '').replace(/\D/g, '');
}

function cpfValido(cpf) {
  const n = somenteDigitos(cpf);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;

  const digito = (qtd) => {
    let soma = 0;
    for (let i = 0; i < qtd; i++) soma += Number(n[i]) * (qtd + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return digito(9) === Number(n[9]) && digito(10) === Number(n[10]);
}

function somenteAlfanumericos(valor) {
  return String(valor || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
}

// CNPJ: aceita o formato numérico clássico e o novo formato alfanumérico
// (12 caracteres letras/números + 2 dígitos verificadores).
// Cada caractere vale (código ASCII - 48): os dígitos valem 0-9, as letras A-Z valem 17-42.
function cnpjValido(cnpj) {
  const n = somenteAlfanumericos(cnpj);
  if (!/^[0-9A-Z]{12}[0-9]{2}$/.test(n) || /^(.)\1{13}$/.test(n)) return false;

  const digito = (qtd) => {
    const pesos =
      qtd === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < qtd; i++) soma += (n.charCodeAt(i) - 48) * pesos[i];
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return digito(12) === Number(n[12]) && digito(13) === Number(n[13]);
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || ''));
}

// Espera o formato AAAA-MM-DD (o mesmo do <input type="date">)
function dataValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(texto || ''))) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const data = new Date(a, m - 1, d);
  const existe =
    data.getFullYear() === a && data.getMonth() === m - 1 && data.getDate() === d;
  return existe && data <= new Date();
}

function calcularIdade(texto) {
  const [a, m, d] = texto.split('-').map(Number);
  const hoje = new Date();
  let idade = hoje.getFullYear() - a;
  const mesAtual = hoje.getMonth() + 1;
  const jaFezAniversario = mesAtual > m || (mesAtual === m && hoje.getDate() >= d);
  if (!jaFezAniversario) idade--;
  return idade;
}

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA',
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

module.exports = { somenteDigitos, somenteAlfanumericos, cpfValido, cnpjValido, emailValido, dataValida, calcularIdade, ESTADOS };