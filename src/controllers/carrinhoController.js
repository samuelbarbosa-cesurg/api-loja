import * as carrinhoLogic from "../logic/carrinhoLogic.js";


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