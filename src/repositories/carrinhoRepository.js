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

// Adiciona um novo item no carrinho.
export async function adicionarItem(usuarioId, produtoId, quantidade) {
  db.prepare("INSERT INTO itens_carrinho (usuario_id, produto_id, quantidade) VALUES (?, ?, ?)").run(usuarioId, produtoId, quantidade);
}

// Remove um item do carrinho.
export async function removerItem(usuarioId, produtoId) {
  db.prepare("DELETE FROM itens_carrinho WHERE usuario_id = ? AND produto_id = ?").run(usuarioId, produtoId);
}

// Remove todos os itens do carrinho do usuário.
export async function esvaziarCarrinho(usuarioId) {
  db.prepare("DELETE FROM itens_carrinho WHERE usuario_id = ?").run(usuarioId);
}

// Atualiza a quantidade de um item que já está no carrinho.
export async function atualizarQuantidade(usuarioId, produtoId, quantidade) {
  db.prepare("UPDATE itens_carrinho SET quantidade = ? WHERE usuario_id = ? AND produto_id = ?").run(quantidade, usuarioId, produtoId);
}