// Em Live Server (localhost) usa a API local; online usa a do Render.
const API_URL = ['localhost', '127.0.0.1'].includes(location.hostname)
  ? 'http://localhost:3000/api/fornecedores'
  : 'https://elo-urbano-api.onrender.com/api/fornecedores';

const $ = (id) => document.getElementById(id);
const valor = (id) => $(id).value.trim();

const form = $('formFornecedor');
const msgSucesso = $('sucessoFornecedor'); 
const mapa = $('miniMapa');
const mapaOriginal = mapa.innerHTML; 


const msgErro = document.createElement('p');
msgErro.className = 'campo-aviso';
msgErro.style.cssText = 'text-align:center;margin-top:8px;';
form.querySelector('.form-acoes').before(msgErro);

// ---------- Rodapé e data de cadastro (só para exibir) ----------
$('year').textContent = new Date().getFullYear();
const preencherData = () => {
  $('data-cadastro').value = new Date().toLocaleDateString('en-CA'); // AAAA-MM-DD
};
preencherData();

// ---------- Mapa ----------
function mostrarMapa(lat, lon) {
  const d = 0.004; // "zoom" do mapa
  const bbox = [lon - d, lat - d / 1.5, lon + d, lat + d / 1.5]
    .map((n) => n.toFixed(6))
    .join(',');
  mapa.style.height = '220px';
  mapa.innerHTML =
    '<iframe title="Localização no mapa" loading="lazy" ' +
    'style="border:0;width:100%;height:100%" ' +
    'src="https://www.openstreetmap.org/export/embed.html?bbox=' + bbox +
    '&layer=mapnik&marker=' + lat + ',' + lon + '"></iframe>';
}

function limparMapa(aviso) {
  mapa.style.height = '';
  mapa.innerHTML = mapaOriginal;
  if (aviso) mapa.querySelector('p').textContent = aviso;
  $('latitude').value = '';
  $('longitude').value = '';
}

// Procura as coordenadas do endereço no OpenStreetMap (Nominatim)
async function buscarCoordenadas(consulta) {
  const url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=' +
    encodeURIComponent(consulta);
  const resp = await fetch(url);
  const lista = await resp.json();
  return lista.length ? { lat: Number(lista[0].lat), lon: Number(lista[0].lon) } : null;
}

let buscaAtual = 0; // evita que uma resposta antiga sobrescreva uma nova
async function localizarNoMapa() {
  const rua = valor('rua');
  const numero = valor('numero');
  const cidade = valor('cidade');
  const uf = valor('estado');
  if (!rua || !cidade || !uf) return;

  const minhaBusca = ++buscaAtual;
  try {
    // 1ª tentativa: com o número; 2ª: só a rua
    let ponto = null;
    if (numero) ponto = await buscarCoordenadas(`${rua} ${numero}, ${cidade}, ${uf}, Brasil`);
    if (!ponto) ponto = await buscarCoordenadas(`${rua}, ${cidade}, ${uf}, Brasil`);
    if (minhaBusca !== buscaAtual) return;

    if (!ponto) {
      limparMapa('Não foi possível localizar o endereço no mapa. Você pode continuar o cadastro.');
      return;
    }
    $('latitude').value = ponto.lat.toFixed(6);
    $('longitude').value = ponto.lon.toFixed(6);
    mostrarMapa(ponto.lat, ponto.lon);
  } catch (e) {
    if (minhaBusca === buscaAtual) {
      limparMapa('Não foi possível consultar o mapa agora. Você pode continuar o cadastro.');
    }
  }
}

// ---------- Buscar CEP (ViaCEP) ----------
$('btn-cep').addEventListener('click', async () => {
  const cep = valor('cep').replace(/\D/g, '');
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
    $('rua').value = dados.logradouro || $('rua').value;
    $('bairro').value = dados.bairro || $('bairro').value;
    $('cidade').value = dados.localidade;
    $('estado').value = dados.uf;
    localizarNoMapa();
  } catch (e) {
    msgErro.textContent = 'Não foi possível consultar o CEP agora.';
  }
});

// Quando o número é preenchido, a localização fica mais precisa
$('numero').addEventListener('change', localizarNoMapa);

// ---------- Envio para a API ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgErro.textContent = '';
  msgSucesso.style.display = 'none';

  const dados = {
    razaoSocial: valor('razao-social'),
    nomeFantasia: valor('nome-fantasia'),
    cnpj: valor('cnpj'),
    inscricaoEstadual: valor('inscricao-estadual'),
    segmento: valor('segmento'),
    cep: valor('cep'),
    rua: valor('rua'),
    numero: valor('numero'),
    bairro: valor('bairro'),
    cidade: valor('cidade'),
    estado: valor('estado'),
    pais: valor('pais'),
    latitude: valor('latitude'),
    longitude: valor('longitude'),
    responsavel: valor('responsavel'),
    telefone: valor('telefone'),
    whatsapp: valor('whatsapp'),
    email: valor('email-fornecedor'),
  };

  const botao = form.querySelector('button[type="submit"]');
  botao.disabled = true;
  botao.textContent = 'Enviando...';

  // O plano gratuito do Render "dorme" sem uso: o 1º envio pode levar ~1 minuto
  const avisoDemora = setTimeout(() => {
    msgErro.style.color = '#5a7a65';
    msgErro.textContent = 'O servidor está acordando (plano gratuito). Aguarde até 1 minuto...';
  }, 4000);

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

    msgErro.textContent = ''; // limpa o aviso de espera
    msgSucesso.style.display = 'block';
    form.reset();
    preencherData();
    limparMapa();
  } catch (erro) {
    msgErro.textContent = 'Não foi possível conectar ao servidor. A API está rodando?';
  } finally {
    clearTimeout(avisoDemora);
    msgErro.style.color = '';
    botao.disabled = false;
    botao.textContent = 'Cadastrar Fornecedor';
  }
});