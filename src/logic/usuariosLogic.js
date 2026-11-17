import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { novoUsuario } from "../models/usuario.js";
import * as usuariosRepository from "../repositories/usuariosRepository.js";

export async function cadastrar(body) {
  const usuario = new novoUsuario(body);

  if (usuariosRepository.buscarPorEmail(usuario.email)) {
    const erro = new Error("Já existe um usuário com esse email");
    erro.status = 409;
    throw erro;
  }

  const senha = await bcrypt.hash(usuario.senha, 10);
  return usuariosRepository.criar({ nome: usuario.nome, email: usuario.email, senha });
}

export async function login({ email, senha } = {}) {
  const usuario = usuariosRepository.buscarPorEmail(String(email ?? "").trim().toLowerCase());
  const senhaConfere = usuario && (await bcrypt.compare(String(senha ?? ""), usuario.senha));


  if (!senhaConfere) {
    const erro = new Error("Email ou senha inválidos");
    erro.status = 401;
    throw erro;
  }

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  return { token };
}