// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";

// Retorna todas as categorias ordenados pelo id.
export async function listarFormasPagamento() {
  const formasPagamento = db.prepare("SELECT * FROM formas_pagamento ORDER BY id").all();
  return formasPagamento;
}