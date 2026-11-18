// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";

// Cria a compra e os itens dela. Se algo der errado, nada é salvo.
export async function criarCompra(usuarioId, quantidadeTotal, total, formaPagamento, itens) {
  db.exec("BEGIN");

  try {
    const resultado = db
      .prepare("INSERT INTO compras (usuario_id, quantidade_total, total, forma_pagamento, criada_em) VALUES (?, ?, ?, ?, ?)")
      .run(usuarioId, quantidadeTotal, total, formaPagamento, new Date().toISOString());

    const compraId = Number(resultado.lastInsertRowid);

    for (const item of itens) {
      db.prepare("INSERT INTO itens_compra (compra_id, produto_id, nome, preco, imagem, quantidade) VALUES (?, ?, ?, ?, ?, ?)")
        .run(compraId, item.produtoId, item.nome, item.preco, item.imagem, item.quantidade);
    }

    db.exec("COMMIT");
    return compraId;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
