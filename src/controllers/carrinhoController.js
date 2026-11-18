import * as carrinhoLogic from "../logic/carrinhoLogic.js";
import { ErroNaoEncontrado } from "../models/erroNaoEncontrado.js";


export async function listarCarrinho(request, response) {
    try{
      const token = request.headers.authorization?.split(" ")[1];
      const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;
      const carrinho = await carrinhoLogic.listarCarrinho(userId);

      if(carrinho.length === 0){
        return response.status(404).json({mensagem: "Nenhuma carrinho encontrado"})
      }

      return response.status(200).json(carrinho);
    } catch (error) {
      console.error(`Erro ao listar carrinho: ${error.message}`);
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

export async function adicionarItem(request, response) {
    try{
      const token = request.headers.authorization?.split(" ")[1];
      const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;
      const { produtoId, quantidade } = request.body ?? {};

      if(!Number.isInteger(produtoId) || produtoId <= 0){
        return response.status(400).json({mensagem: "O produtoId precisa ser um número inteiro maior que zero"})
      }

      if(!Number.isInteger(quantidade) || quantidade <= 0){
        return response.status(400).json({mensagem: "A quantidade precisa ser um número inteiro maior que zero"})
      }

      await carrinhoLogic.adicionarItem(userId, produtoId, quantidade);

      return response.status(201).send();
    } catch (error) {
      console.error(`Erro ao adicionar item no carrinho: ${error.message}`);
      if(error instanceof ErroNaoEncontrado) {
        return response.status(404).json({
            mensagem: error.message,
        });
      }

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