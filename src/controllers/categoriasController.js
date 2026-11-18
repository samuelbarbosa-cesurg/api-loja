import * as categoriasLogic from "../logic/categoriasLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";


export async function listarCategorias(request, response) {
    try{
      const categorias = await categoriasLogic.listarCategorias();

      if(categorias.length === 0){
        return response.status(404).json({erro: "Nenhuma categoria encontrado"})
      }

      return response.status(200).json(categorias);
    } catch (error) {
      console.error(`Erro ao listar categorias: ${error.message}`);
      if(error instanceof ErroValidacao) {
        return response.status(400).json({
            erro: error.message,
        });
      }

      return response.status(500).json({
        erro: "Erro interno do servidor",
      });
    }
}