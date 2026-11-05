// Envia o formulário de cliente para a API do Elo Urbano.
// Troque API_URL pelo endereço real da API quando for publicada.
const API_URL = 'http://localhost:3000/api/clientes';

const form = document.getElementById('formCliente');
const msgSucesso = document.getElementById('sucessoCliente');

// Cria a área de erro uma única vez, logo antes do botão de enviar
const msgErro = document.createElement('p');
msgErro.className = 'campo-aviso';
msgErro.style.cssText = 'text-align:center;margin-top:8px;';
form.querySelector('.form-acoes').before(msgErro);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgErro.textContent = '';
  msgSucesso.style.display = 'none';

  const valor = (id) => document.getElementById(id).value.trim();

  const dados = {
    nomeCompleto: valor('nome-completo'),
    cpf: valor('cpf'),
    dataNascimento: valor('data-nascimento'),
    email: valor('email-cliente'),
    telefone: valor('telefone-cliente'),
    senha: document.getElementById('senha').value,
    confirmarSenha: document.getElementById('confirmar-senha').value,
    cep: valor('cep-cliente'),
    cidade: valor('cidade-cliente'),
    estado: valor('estado-cliente'),
    latitude: valor('lat-cliente'),
    longitude: valor('lng-cliente'),
  };

  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  botao.textContent = 'Enviando...';

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    const resultado = await resposta.json();

    if (!resposta.ok) {
      // Mostra a mensagem principal + a lista de problemas, se houver
      const lista = resultado.detalhes ? ' ' + resultado.detalhes.join(' ') : '';
      msgErro.textContent = resultado.erro + lista;
      return;
    }

    msgSucesso.textContent = '✅ ' + resultado.mensagem;
    msgSucesso.style.display = 'block';
    form.reset();
  } catch (erro) {
    msgErro.textContent = 'Não foi possível conectar ao servidor. Tente novamente.';
  } finally {
    botao.disabled = false;
    botao.textContent = 'Criar Minha Conta';
  }
});
