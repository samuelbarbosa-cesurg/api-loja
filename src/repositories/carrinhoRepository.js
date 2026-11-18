// O repository é a única camada que conhece o banco e os comandos SQL.
// As outras camadas trabalham apenas com objetos JavaScript.
import db from "../database/conexao.js";

// Retorna todas as categorias ordenados pelo id.
export async function listarCarrinho(usuarioId) {
  const carrinho = db.prepare("SELECT * FROM itens_carrinho WHERE usuario_id = ? ORDER BY usuario_id").all(usuarioId);
  return carrinho;
}