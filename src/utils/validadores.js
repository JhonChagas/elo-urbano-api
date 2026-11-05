// Funções puras de validação, reaproveitadas pelos Models.

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

module.exports = { somenteDigitos, cpfValido, emailValido, dataValida, calcularIdade, ESTADOS };
