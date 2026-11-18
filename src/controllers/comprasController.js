import * as comprasLogic from "../logic/comprasLogic.js";

export async function criarCompra(request, response) {
    try{
      const token = request.headers.authorization?.split(" ")[1];
      const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;
      const { formaPagamento } = request.body ?? {};

      if(typeof formaPagamento !== "string" || formaPagamento === ""){
        return response.status(400).json({mensagem: "A formaPagamento é obrigatória"})
      }

      await comprasLogic.criarCompra(userId, formaPagamento);

      return response.status(201).send();
    } catch (error) {
      console.error(`Erro ao criar compra: ${error.message}`);
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
