import * as formasPagamentoLogic from "../logic/formasPagamentoLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";


export async function listarFormasPagamento(request, response) {
    try{
      const formasPagamento = await formasPagamentoLogic.listarFormasPagamento();

      if(formasPagamento.length === 0){
        return response.status(404).json({erro: "Nenhuma categoria encontrado"})
      }

      return response.status(200).json(formasPagamento);
    } catch (error) {
      console.error(`Erro ao listar formasPagamento: ${error.message}`);
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