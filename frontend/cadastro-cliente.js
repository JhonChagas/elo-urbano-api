const API_URL = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? 'http://localhost:3000/api/clientes'
  : 'https://SEU-APP.onrender.com/api/clientes'; // <- troque pelo endereço do Render

const $ = (id) => document.getElementById(id);
const valor = (id) => $(id).value.trim();

const form = $('formCliente');
const msgSucesso = $('sucessoCliente');

// Área de erro geral (criada uma vez, antes dos botões)
const msgErro = document.createElement('p');
msgErro.className = 'campo-aviso';
msgErro.style.cssText = 'text-align:center;margin-top:8px;';
form.querySelector('.form-acoes').before(msgErro);

// ---------- Ano no rodapé ----------
$('year').textContent = new Date().getFullYear();

// ---------- Mostrar / ocultar senha ----------
$('btn-ver-senha').addEventListener('click', () => {
  const mostrar = $('senha').type === 'password';
  $('senha').type = mostrar ? 'text' : 'password';
  $('confirmar-senha').type = mostrar ? 'text' : 'password';
});

// ---------- Aviso se as senhas não conferem ----------
$('confirmar-senha').addEventListener('input', () => {
  const diferente = $('confirmar-senha').value !== $('senha').value;
  $('aviso-senha').textContent = diferente ? 'As senhas não conferem.' : '';
});

// ---------- Buscar CEP (ViaCEP) ----------
$('btn-cep-cliente').addEventListener('click', async () => {
  const cep = valor('cep-cliente').replace(/\D/g, '');
  if (cep.length !== 8) {
    msgErro.textContent = 'Digite um CEP com 8 números.';
    return;
  }
  msgErro.textContent = '';
  try {
    const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const dados = await resp.json();
    if (dados.erro) {
      msgErro.textContent = 'CEP não encontrado.';
      return;
    }
    $('cidade-cliente').value = dados.localidade;
    $('estado-cliente').value = dados.uf;
  } catch (e) {
    msgErro.textContent = 'Não foi possível consultar o CEP agora.';
  }
});

// ---------- Localização atual (GPS) ----------
$('btn-gps').addEventListener('click', () => {
  const aviso = $('aviso-gps');
  aviso.style.color = '';

  if (!navigator.geolocation) {
    aviso.textContent = 'Seu navegador não suporta geolocalização.';
    return;
  }
  aviso.textContent = 'Obtendo localização...';

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      $('lat-cliente').value = pos.coords.latitude.toFixed(6);
      $('lng-cliente').value = pos.coords.longitude.toFixed(6);
      $('btn-gps').classList.add('ativo');
      aviso.style.color = '#065f46';
      aviso.textContent = 'Localização capturada com sucesso.';
    },
    () => {
      aviso.textContent = 'Não foi possível obter a localização. Verifique a permissão do navegador.';
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

// ---------- Envio para a API ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgErro.textContent = '';
  msgSucesso.style.display = 'none';

  const dados = {
    nomeCompleto: valor('nome-completo'),
    cpf: valor('cpf'),
    dataNascimento: valor('data-nascimento'),
    email: valor('email-cliente'),
    telefone: valor('telefone-cliente'),
    senha: $('senha').value,
    confirmarSenha: $('confirmar-senha').value,
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
      const lista = resultado.detalhes ? ' ' + resultado.detalhes.join(' ') : '';
      msgErro.textContent = resultado.erro + lista;
      return;
    }

    msgSucesso.textContent = '✅ ' + resultado.mensagem;
    msgSucesso.style.display = 'block';
    form.reset();
    $('btn-gps').classList.remove('ativo');
    $('aviso-gps').textContent = '';
  } catch (erro) {
    msgErro.textContent = 'Não foi possível conectar ao servidor. A API está rodando?';
  } finally {
    botao.disabled = false;
    botao.textContent = 'Criar Minha Conta';
  }
});