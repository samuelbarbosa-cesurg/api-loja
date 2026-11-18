import * as produtosRepository from "../repositories/produtosRepository.js";

export async function listarProdutos(params) {
	const filtroCategoria = params.categoria ?? '';
	const filtroBusca = params.busca ?? '';
	
	return await produtosRepository.listarProdutos(filtroCategoria, filtroBusca);
}

export async function buscarPorId(id) {
	const idFiltrado = Number(id);
	const produto = await produtosRepository.buscarPorId(idFiltrado);

	if (!isNaN(idFiltrado)) {
		return produto;
	}

	return null;
}
