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
	await definirQuantidade(usuarioId, produto, quantidade);
}

async function definirQuantidade(usuarioId, produto, quantidade) {
	const definirQuantidade = await carrinhoRepository.definirQuantidade(usuarioId, produto.id, quantidade);
	if (!definirQuantidade) {
		const item = await carrinhoRepository.buscarItem(usuarioId, produto.id);
		const disponivel = produto.estoque + (item?.quantidade ?? 0);
		throw new ErroValidacao(`Estoque insuficiente: há ${disponivel} unidade(s) de "${produto.nome}".`);
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

	await definirQuantidade(usuarioId, produto, quantidade);
	return listarCarrinho(usuarioId);
}