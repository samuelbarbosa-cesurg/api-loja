import * as comprasRepository from "../repositories/comprasRepository.js";
import * as carrinhoRepository from "../repositories/carrinhoRepository.js";
import * as formasPagamentoRepository from "../repositories/formasPagamentoRepository.js";
import * as carrinhoLogic from "./carrinhoLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";

export async function listarCompras(usuarioId) {
	const compras = await comprasRepository.listarCompras(usuarioId);

	for (const compra of compras) {
		const itens = await comprasRepository.listarItensCompra(compra.id);
		compra.itens = itens.map((item) => ({ ...item, subtotal: item.preco * item.quantidade }));
	}

	return compras;
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

	await carrinhoRepository.esvaziarCarrinho(usuarioId);

	return compraId;
}
