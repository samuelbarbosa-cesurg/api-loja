import * as usuariosLogic from "../logic/usuariosLogic.js";
import { ErroValidacao } from "../models/erroValidacao.js";

export async function cadastrar(request, response) {
  try {
    const usuario = await usuariosLogic.cadastrar(request.body ?? {});
    return response.status(201).json(usuario);
  } catch (error) {
    return responderErro(error, response);
  }
}

export async function login(request, response) {
  try {
    const resultado = await usuariosLogic.login(request.body ?? {});
    return response.status(200).json(resultado);
  } catch (error) {
    return responderErro(error, response);
  }
}

function responderErro(error, response) {
  if (error instanceof ErroValidacao) {
    return response.status(400).json({ erro: error.message });
  }

  if (error.status) {
    return response.status(error.status).json({ erro: error.message });
  }

  console.error(`Erro inesperado: ${error.message}`);
  return response.status(500).json({ erro: "Erro interno do servidor" });
}
