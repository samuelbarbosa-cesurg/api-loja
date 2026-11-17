import * as produtosRepository from "../repositories/produtosRepository.js";

// Mantém a rota inicial GET / retornando a primeira tarefa do banco.
export async function listarProdutos() {
  return await produtosRepository.listarProdutos();
}

export async function buscarProduto(id) {
  const idFiltrado = Number(id);
  const produtos = await produtosRepository.listarProdutos();

  if (!isNaN(idFiltrado)) {
    const produtoFiltrado = produtos.find(
      (produto) => produto.id === idFiltrado,
    );
    return produtoFiltrado;
  }

  return null;
}
