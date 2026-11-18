import * as comprasLogic from "../logic/comprasLogic.js";

export async function listarCompras(request, response) {
    try{
      const token = request.headers.authorization?.split(" ")[1];
      const userId = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString()).id;

      const compras = await comprasLogic.listarCompras(userId);

      return response.status(200).json(compras);
    } catch (error) {
      console.error(`Erro ao listar compras: ${error.message}`);
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
