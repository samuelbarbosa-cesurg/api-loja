import * as produtosRepository from "../repositories/produtosRepository.js";

export async function listarProdutos(params) {
	const filtroCategoria = params.categoria ?? '';
	const filtroBusca = params.busca ?? '';
	
	return await produtosRepository.listarProdutos(filtroCategoria, filtroBusca);
}

export async function buscarProduto(id) {
	const idFiltrado = Number(id);
	const produtos = await produtosRepository.listarProdutos();

	if (!isNaN(idFiltrado)) {
		const produtoFiltrado = produtos.find((produto) => produto.id === idFiltrado);
		return produtoFiltrado;
	}

	return null;
}
