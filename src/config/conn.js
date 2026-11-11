require('dotenv').config();
const path = require('path');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

function carregarCredenciais() {
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  
  const caminho = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!caminho) {
    throw new Error(
      'Credenciais do Firebase não encontradas. Defina FIREBASE_SERVICE_ACCOUNT_PATH no arquivo .env'
    );
  }
  return require(path.resolve(caminho));
}


if (!getApps().length) {
  initializeApp({ credential: cert(carregarCredenciais()) });
}

const db = getFirestore();
const auth = getAuth();

module.exports = { db, auth };
