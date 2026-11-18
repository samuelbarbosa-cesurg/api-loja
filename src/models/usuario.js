import { ErroValidacao } from "./erroValidacao.js";

export class novoUsuario {
  constructor({ nome, email, senha }) {
    if (typeof nome !== "string" || nome.trim().length < 2) {
      throw new ErroValidacao("O nome deve ter pelo menos 2 caracteres");
    }
    if (typeof email !== "string" || !email.includes("@")) {
      throw new ErroValidacao("Informe um email válido");
    }
    if (typeof senha !== "string" || senha.length < 6) {
      throw new ErroValidacao("A senha deve ter pelo menos 6 caracteres");
    }

    this.nome = nome.trim();
    this.email = email.trim().toLowerCase();
    this.senha = senha;
  }
}