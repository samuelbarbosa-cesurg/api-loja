// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";

// Retorna todas as categorias ordenados pelo id.
export async function listarCarrinho(usuarioId) {
  const carrinho = db.prepare(`
    SELECT
      produtos.id AS produtoId,
      produtos.nome,
      produtos.preco,
      produtos.imagem,
      itens_carrinho.quantidade
    FROM itens_carrinho
    JOIN produtos ON produtos.id = itens_carrinho.produto_id
    WHERE itens_carrinho.usuario_id = ?
    ORDER BY produtos.id
  `).all(usuarioId);
  return carrinho;
}

// Busca um item do carrinho do usuário pelo id do produto.
export async function buscarItem(usuarioId, produtoId) {
  return db.prepare("SELECT * FROM itens_carrinho WHERE usuario_id = ? AND produto_id = ?").get(usuarioId, produtoId) ?? null;
}

// Grava a quantidade total do item no carrinho e ajusta o estoque pela diferença.
export async function definirQuantidade(usuarioId, produtoId, quantidade) {
  db.exec("BEGIN");

  try {
    const item = db
      .prepare("SELECT quantidade FROM itens_carrinho WHERE usuario_id = ? AND produto_id = ?")
      .get(usuarioId, produtoId);
    const diferenca = quantidade - (item?.quantidade ?? 0);

    // Só atualiza se o estoque cobrir a diferença. Diferença negativa devolve ao estoque.
    const ajuste = db
      .prepare("UPDATE produtos SET estoque = estoque - ? WHERE id = ? AND estoque >= ?")
      .run(diferenca, produtoId, diferenca);

    if (ajuste.changes === 0) {
      db.exec("ROLLBACK");
      return false;
    }

    // Insere o item, ou troca a quantidade se ele já existir.
    db.prepare(`
      INSERT INTO itens_carrinho (usuario_id, produto_id, quantidade) VALUES (?, ?, ?)
      ON CONFLICT (usuario_id, produto_id) DO UPDATE SET quantidade = excluded.quantidade
    `).run(usuarioId, produtoId, quantidade);

    db.exec("COMMIT");
    return true;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

// Remove um item do carrinho e devolve a quantidade dele ao estoque.
export async function removerItem(usuarioId, produtoId) {
  db.exec("BEGIN");

  try {
    const item = db
      .prepare("DELETE FROM itens_carrinho WHERE usuario_id = ? AND produto_id = ? RETURNING quantidade")
      .get(usuarioId, produtoId);

    if (item) {
      db.prepare("UPDATE produtos SET estoque = estoque + ? WHERE id = ?").run(item.quantidade, produtoId);
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

// Remove todos os itens do carrinho do usuário e devolve as quantidades ao estoque.
export async function esvaziarCarrinho(usuarioId) {
  db.exec("BEGIN");

  try {
    const itens = db
      .prepare("DELETE FROM itens_carrinho WHERE usuario_id = ? RETURNING produto_id AS produtoId, quantidade")
      .all(usuarioId);

    for (const item of itens) {
      db.prepare("UPDATE produtos SET estoque = estoque + ? WHERE id = ?").run(item.quantidade, item.produtoId);
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}