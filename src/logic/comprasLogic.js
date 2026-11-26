import * as comprasRepository from "../repositories/comprasRepository.js";
import * as formasPagamentoRepository from "../repositories/formasPagamentoRepository.js";
import * as carrinhoLogic from "./carrinhoLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";
import { ErroNaoEncontrado } from "../models/erroNaoEncontrado.js";

export async function listarCompras(usuarioId) {
	const compras = await comprasRepository.listarCompras(usuarioId);

	for (const compra of compras) {
		const itens = await comprasRepository.listarItensCompra(compra.id);
		compra.itens = itens.map((item) => ({ ...item, subtotal: item.preco * item.quantidade }));
	}

	return compras;
}

export async function buscarPorId(id, usuarioId) {
	const compra = await comprasRepository.buscarPorId(id, usuarioId);
	if (!compra) {
		throw new ErroNaoEncontrado("Compra não encontrada");
	}

	const itens = await comprasRepository.listarItensCompra(compra.id);
	compra.itens = itens.map((item) => ({ ...item, subtotal: item.preco * item.quantidade }));

	return compra;
}

export async function criarCompra(usuarioId, formaPagamento) {
	const formasPagamento = await formasPagamentoRepository.listarFormasPagamento();
	const formaValida = formasPagamento.find((forma) => forma.id === formaPagamento);
	if (!formaValida) {
		throw new ErroValidacao("Forma de pagamento inválida");
	}

	const carrinho = await carrinhoLogic.listarCarrinho(usuarioId);
	if (carrinho.itens.length === 0) {
		throw new ErroValidacao("O carrinho está vazio");
	}

	const compraId = await comprasRepository.criarCompra(
		usuarioId,
		carrinho.quantidadeTotal,
		carrinho.total,
		formaPagamento,
		carrinho.itens
	);

	return compraId;
}
