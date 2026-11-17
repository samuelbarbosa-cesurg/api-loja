import * as usuariosLogic from "../logic/usuariosLogic.js";

export async function verificarStatusApi(request, response) {
  return response.status(200).json();
}