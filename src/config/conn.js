// ===========================================================
// 1. CONEXÃO COM O FIREBASE (conn.js)
// Único arquivo que "conhece" as credenciais do Firebase.
// Exporta:
//   db   -> Firestore (banco de dados)
//   auth -> Firebase Authentication (login/senha)
// ===========================================================
require('dotenv').config();
const path = require('path');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

function carregarCredenciais() {
  // Opção 1 (deploy): JSON inteiro dentro de uma variável de ambiente
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  // Opção 2 (local): caminho do arquivo .json baixado do Firebase
  const caminho = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!caminho) {
    throw new Error(
      'Credenciais do Firebase não encontradas. Defina FIREBASE_SERVICE_ACCOUNT_PATH no arquivo .env'
    );
  }
  return require(path.resolve(caminho));
}

// Evita inicializar duas vezes
if (!getApps().length) {
  initializeApp({ credential: cert(carregarCredenciais()) });
}

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth };
