import * as categoriasLogic from "../logic/categoriasLogic.js";


export async function listarCategorias(request, response) {
    try{
      const categorias = await categoriasLogic.listarCategorias();

      if(categorias.length === 0){
        return response.status(404).json({mensagem: "Nenhuma categoria encontrado"})
      }

      return response.status(200).json(categorias);
    } catch (error) {
      console.error(`Erro ao listar categorias: ${error.message}`);
      if(error instanceof Error) {
        return response.status(400).json({
            mensagem: error.message,
        });
      }

      return response.status(500).json({
        mensagem: "Erro interno do servidor",
      });
    }
}