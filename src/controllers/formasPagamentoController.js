import * as formasPagamentoLogic from "../logic/formasPagamentoLogic.js";


export async function listarFormasPagamento(request, response) {
    try{
      const formasPagamento = await formasPagamentoLogic.listarFormasPagamento();

      if(formasPagamento.length === 0){
        return response.status(404).json({mensagem: "Nenhuma categoria encontrado"})
      }

      return response.status(200).json(formasPagamento);
    } catch (error) {
      console.error(`Erro ao listar formasPagamento: ${error.message}`);
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