import * as carrinhoRepository from "../repositories/carrinhoRepository.js";
import * as produtosRepository from "../repositories/produtosRepository.js";
import { ErroNaoEncontrado } from "../models/erroNaoEncontrado.js";

export async function listarCarrinho(usuarioId) {
	return await carrinhoRepository.listarCarrinho(usuarioId);
}

export async function adicionarItem(usuarioId, produtoId, quantidade) {
	const produto = await produtosRepository.buscarPorId(produtoId);
	if (!produto) {
		throw new ErroNaoEncontrado("Produto não encontrado");
	}

	const item = await carrinhoRepository.buscarItem(usuarioId, produtoId);
	if (item) {
		await carrinhoRepository.atualizarQuantidade(usuarioId, produtoId, item.quantidade + quantidade);
	} else {
		await carrinhoRepository.adicionarItem(usuarioId, produtoId, quantidade);
	}
}