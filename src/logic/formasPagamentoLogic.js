import * as formasPagamentoRepository from "../repositories/formasPagamentoRepository.js";

export async function listarFormasPagamento() {
	return await formasPagamentoRepository.listarFormasPagamento();
}