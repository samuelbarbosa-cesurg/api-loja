import * as carrinhoLogic from "../logic/carrinhoLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";
import { ErroNaoEncontrado } from "../models/erroNaoEncontrado.js";


export async function listarCarrinho(request, response) {
    try{
      const token = request.headers.authorization?.split(" ")[1];
      const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;
      const carrinho = await carrinhoLogic.listarCarrinho(userId);

      return response.status(200).json(carrinho);
    } catch (error) {
      console.error(`Erro ao listar carrinho: ${error.message}`);
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

export async function adicionarItem(request, response) {
    try{
      const token = request.headers.authorization?.split(" ")[1];
      const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;
      const { produtoId, quantidade = 1 } = request.body ?? {};

      if(!Number.isInteger(produtoId) || produtoId <= 0){
        return response.status(400).json({erro: "O produtoId precisa ser um número inteiro maior que zero"})
      }

      if(!Number.isInteger(quantidade) || quantidade <= 0){
        return response.status(400).json({erro: "A quantidade precisa ser um número inteiro maior que zero"})
      }

      const itemAdicionado = await carrinhoLogic.adicionarItem(userId, produtoId, quantidade);

      return response.status(201).json(itemAdicionado);
    } catch (error) {
      console.error(`Erro ao adicionar item no carrinho: ${error.message}`);
      if(error instanceof ErroNaoEncontrado) {
        return response.status(404).json({
            erro: error.message,
        });
      }

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

export async function atualizarQuantidade(request, response) {
    try{
      const token = request.headers.authorization?.split(" ")[1];
      const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;
      const produtoId = Number(request.params.produtoId);
      const body = request.body ?? {};

      if(!Number.isInteger(produtoId) || produtoId <= 0){
        return response.status(400).json({erro: "O produtoId precisa ser um número inteiro maior que zero"})
      }

      if(Object.keys(body).length !== 1 || !("quantidade" in body)){
        return response.status(400).json({erro: "O body deve conter apenas a quantidade"})
      }

      if(!Number.isInteger(body.quantidade) || body.quantidade <= 0){
        return response.status(400).json({erro: "A quantidade precisa ser um número inteiro maior que zero"})
      }

      await carrinhoLogic.atualizarQuantidade(userId, produtoId, body.quantidade);

      return response.status(200).send();
    } catch (error) {
      console.error(`Erro ao atualizar item do carrinho: ${error.message}`);
      if(error instanceof ErroNaoEncontrado) {
        return response.status(404).json({
            erro: error.message,
        });
      }

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

export async function esvaziarCarrinho(request, response) {
    try{
      const token = request.headers.authorization?.split(" ")[1];
      const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;

      await carrinhoLogic.esvaziarCarrinho(userId);

      return response.status(200).send();
    } catch (error) {
      console.error(`Erro ao esvaziar carrinho: ${error.message}`);
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

export async function removerItem(request, response) {
    try{
      const token = request.headers.authorization?.split(" ")[1];
      const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;
      const produtoId = Number(request.params.produtoId);

      if(!Number.isInteger(produtoId) || produtoId <= 0){
        return response.status(400).json({erro: "O produtoId precisa ser um número inteiro maior que zero"})
      }

      await carrinhoLogic.removerItem(userId, produtoId);

      return response.status(200).send();
    } catch (error) {
      console.error(`Erro ao remover item do carrinho: ${error.message}`);
      if(error instanceof ErroNaoEncontrado) {
        return response.status(404).json({
            erro: error.message,
        });
      }

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