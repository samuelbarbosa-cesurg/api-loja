import * as carrinhoRepository from "../repositories/carrinhoRepository.js";
import * as produtosRepository from "../repositories/produtosRepository.js";
import { ErroNaoEncontrado } from "../models/erroNaoEncontrado.js";
import { ErroValidacao } from "../models/erroValidacao.js";

export async function listarCarrinho(usuarioId) {
	const itensCarrinho = await carrinhoRepository.listarCarrinho(usuarioId);

	let quantidadeTotal = 0;
	let total = 0;

	const itens = itensCarrinho.map((item) => {
		const subtotal = item.preco * item.quantidade;
		quantidadeTotal += item.quantidade;
		total += subtotal;

		return { ...item, subtotal };
	});

	return { usuarioId, itens, quantidadeTotal, total };
}

export async function atualizarQuantidade(usuarioId, produtoId, quantidade) {
	const item = await carrinhoRepository.buscarItem(usuarioId, produtoId);
	if (!item) {
		throw new ErroNaoEncontrado("Item não encontrado no carrinho");
	}

	const produto = await produtosRepository.buscarPorId(produtoId);
	verificarEstoque(produto, quantidade);

	await carrinhoRepository.atualizarQuantidade(usuarioId, produtoId, quantidade);
}

export function verificarEstoque(produto, quantidade) {
	if (quantidade > produto.estoque) {
		throw new ErroValidacao(`Estoque insuficiente: há ${produto.estoque} unidade(s) de "${produto.nome}".`);
	}
}

export async function esvaziarCarrinho(usuarioId) {
	await carrinhoRepository.esvaziarCarrinho(usuarioId);
}

export async function removerItem(usuarioId, produtoId) {
	const item = await carrinhoRepository.buscarItem(usuarioId, produtoId);
	if (!item) {
		throw new ErroNaoEncontrado("Item não encontrado no carrinho");
	}

	await carrinhoRepository.removerItem(usuarioId, produtoId);
}

export async function adicionarItem(usuarioId, produtoId, quantidade) {
	const produto = await produtosRepository.buscarPorId(produtoId);
	if (!produto) {
		throw new ErroNaoEncontrado("Produto não encontrado");
	}

	const item = await carrinhoRepository.buscarItem(usuarioId, produtoId);
	if (item) {
		const novaQuantidade = item.quantidade + quantidade;
		verificarEstoque(produto, novaQuantidade);
		await carrinhoRepository.atualizarQuantidade(usuarioId, produtoId, novaQuantidade);
		return { produtoId: produtoId, quantidade: novaQuantidade };
	} else {
		verificarEstoque(produto, quantidade);
		await carrinhoRepository.adicionarItem(usuarioId, produtoId, quantidade);
		return { produtoId: produtoId, quantidade: quantidade };
	}
}