import * as produtosRepository from "../repositories/produtosRepository.js";
import * as categoriasRepository from "../repositories/categoriasRepository.js";
import { ErroValidacao } from "../models/erroValidacao.js";

export async function listarProdutos(params) {
	const filtroCategoria = params.categoria ?? '';
	const filtroBusca = params.busca ?? '';

	if (filtroCategoria) {
		const categorias = await categoriasRepository.listarCategorias();
		const categoriaValida = categorias.find((categoria) => categoria.id === filtroCategoria);
		if (!categoriaValida) {
			throw new ErroValidacao("Categoria inválida");
		}
	}

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
