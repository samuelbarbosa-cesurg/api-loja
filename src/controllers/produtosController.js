import * as produtosLogic from "../logic/produtosLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";


export async function listarProdutos(request, response) {
    try{
      const produtos = await produtosLogic.listarProdutos(request.query);

      if(produtos.length === 0){
        return response.status(404).json({erro: "Nenhum produto encontrado"})
      }

      return response.status(200).json(produtos);
    } catch (error) {
      console.error(`Erro ao listar produtos: ${error.message}`);
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

export async function buscarPorId(request, response){
    try{
        const id = request.params.id;
        if(Number.isInteger(Number(id)) && Number(id) > 0){
            const produto = await produtosLogic.buscarPorId(id);
            if(!produto){
                return response.status(404).json({erro: "Produto não encontrado"})
            }
            return response.status(200).json(produto);
        }else{
            return response.status(400).json({erro: "O ID do produto precisa ser um número"})
        }
    } catch (error) {
        console.error(`Erro ao buscar produto: ${error.message}`);

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