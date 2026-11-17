import db from "../database/conexao.js";

export function criar({ nome, email, senha }) {
  const resultado = db
    .prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)")
    .run(nome, email, senha);

  return { id: Number(resultado.lastInsertRowid), nome, email };
}

export function buscarPorEmail(email) {
  return db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email) ?? null;
}