// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";

// Retorna as compras do usuário, da mais recente para a mais antiga.
export async function listarCompras(usuarioId) {
  return db.prepare(`
    SELECT
      id,
      usuario_id AS usuarioId,
      quantidade_total AS quantidadeTotal,
      total,
      forma_pagamento AS formaPagamento,
      status,
      criada_em AS criadaEm
    FROM compras
    WHERE usuario_id = ?
    ORDER BY id DESC
  `).all(usuarioId);
}

// Retorna os itens de uma compra.
export async function listarItensCompra(compraId) {
  return db.prepare(`
    SELECT produto_id AS produtoId, nome, preco, imagem, quantidade
    FROM itens_compra
    WHERE compra_id = ?
    ORDER BY produto_id
  `).all(compraId);
}

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
