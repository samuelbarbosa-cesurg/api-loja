import * as carrinhoRepository from "../repositories/carrinhoRepository.js";

export async function listarCarrinho(usuarioId) {
	return await carrinhoRepository.listarCarrinho(usuarioId);
}