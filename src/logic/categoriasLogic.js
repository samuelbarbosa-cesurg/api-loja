import * as categoriasRepository from "../repositories/categoriasRepository.js";

export async function listarCategorias() {
	return await categoriasRepository.listarCategorias();
}