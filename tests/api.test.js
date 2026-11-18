import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Os testes usam um banco temporário, para não mexer no data/banco.db de verdade.
const pastaOriginal = process.cwd();
const pastaTemporaria = fs.mkdtempSync(path.join(os.tmpdir(), "api-loja-"));
fs.mkdirSync(path.join(pastaTemporaria, "data"));
fs.copyFileSync(
  path.join(pastaOriginal, "data", "banco.sql"),
  path.join(pastaTemporaria, "data", "banco.sql"),
);
process.chdir(pastaTemporaria);
process.env.JWT_SECRET = "segredo-de-teste";

const { default: app } = await import("../src/server.js");

let servidor;
let url;

before(async () => {
  servidor = app.listen(0);
  await new Promise((resolve) => servidor.once("listening", resolve));
  url = `http://localhost:${servidor.address().port}`;
});

after(() => {
  servidor.close();
  process.chdir(pastaOriginal);
});

async function requisicao(metodo, rota, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(url + rota, {
    method: metodo,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const texto = await resposta.text();
  return { status: resposta.status, dados: texto ? JSON.parse(texto) : null };
}

const usuario = { nome: "Maria Teste", email: "maria@teste.com", senha: "123456" };
let token;
let compraId;

test("1. GET /status sem token", async () => {
  const { status } = await requisicao("GET", "/status");
  assert.equal(status, 200);
});

test("2. GET /produtos sem token", async () => {
  const { status } = await requisicao("GET", "/produtos");
  assert.equal(status, 401);
});

test("3. POST /usuarios cadastra sem devolver a senha", async () => {
  const { status, dados } = await requisicao("POST", "/usuarios", usuario);
  assert.equal(status, 201);
  assert.equal(dados.email, usuario.email);
  assert.equal(dados.senha, undefined);
});

test("4. POST /usuarios com o mesmo e-mail", async () => {
  const { status } = await requisicao("POST", "/usuarios", usuario);
  assert.equal(status, 409);
});

test("5. POST /login com e-mail e senha certos", async () => {
  const { status, dados } = await requisicao("POST", "/login", {
    email: usuario.email,
    senha: usuario.senha,
  });
  assert.equal(status, 200);
  assert.ok(dados.token);
  token = dados.token;
});

test("6. POST /login com a senha errada", async () => {
  const { status } = await requisicao("POST", "/login", {
    email: usuario.email,
    senha: "senha-errada",
  });
  assert.equal(status, 401);
});

test("7. GET /produtos com token inventado", async () => {
  const { status } = await requisicao("GET", "/produtos", null, "token.inventado.123");
  assert.equal(status, 401);
});

test("8. GET /produtos?categoria=livros&busca=react", async () => {
  const { status, dados } = await requisicao("GET", "/produtos?categoria=livros&busca=react", null, token);
  assert.equal(status, 200);
  assert.ok(dados.length > 0);
  for (const produto of dados) {
    assert.equal(produto.categoria, "livros");
    assert.ok(produto.nome.toLowerCase().includes("react"));
  }
});

test("9. GET /produtos/9999", async () => {
  const { status } = await requisicao("GET", "/produtos/9999", null, token);
  assert.equal(status, 404);
});

test("10. GET /carrinho vazio", async () => {
  const { status, dados } = await requisicao("GET", "/carrinho", null, token);
  assert.equal(status, 200);
  assert.deepEqual(dados.itens, []);
  assert.equal(dados.total, 0);
});

test("11. POST /carrinho/itens duas vezes soma a quantidade", async () => {
  const primeira = await requisicao("POST", "/carrinho/itens", { produtoId: 1 }, token);
  const segunda = await requisicao("POST", "/carrinho/itens", { produtoId: 1 }, token);
  assert.equal(primeira.status, 201);
  assert.equal(segunda.status, 201);

  const { dados } = await requisicao("GET", "/carrinho", null, token);
  assert.equal(dados.itens.length, 1);
  assert.equal(dados.itens[0].quantidade, 2);
});

test("12. POST /carrinho/itens com quantidade maior que o estoque", async () => {
  const { status, dados } = await requisicao("POST", "/carrinho/itens", { produtoId: 12, quantidade: 999 }, token);
  assert.equal(status, 400);
  assert.match(dados.erro, /Estoque insuficiente/);
});

test("13. PATCH /carrinho/itens/1 com quantidade 0", async () => {
  const { status } = await requisicao("PATCH", "/carrinho/itens/1", { quantidade: 0 }, token);
  assert.equal(status, 400);
});

test("14. DELETE /carrinho/itens/9999", async () => {
  const { status } = await requisicao("DELETE", "/carrinho/itens/9999", null, token);
  assert.equal(status, 404);
});

test("15. POST /compras com formaPagamento dinheiro", async () => {
  const { status } = await requisicao("POST", "/compras", { formaPagamento: "dinheiro" }, token);
  assert.equal(status, 400);
});

test("16. POST /compras com formaPagamento pix", async () => {
  const { status } = await requisicao("POST", "/compras", { formaPagamento: "pix" }, token);
  assert.equal(status, 201);

  const { dados } = await requisicao("GET", "/compras", null, token);
  assert.equal(dados[0].status, "confirmada");
  compraId = dados[0].id;
});

test("17. GET /carrinho depois da compra", async () => {
  const { status, dados } = await requisicao("GET", "/carrinho", null, token);
  assert.equal(status, 200);
  assert.deepEqual(dados.itens, []);
  assert.equal(dados.total, 0);
});

test("18. GET /produtos/1 depois da compra tem 2 unidades a menos", async () => {
  const { status, dados } = await requisicao("GET", "/produtos/1", null, token);
  assert.equal(status, 200);
  assert.equal(dados.estoque, 13);
});

test("19. POST /compras com o carrinho vazio", async () => {
  const { status } = await requisicao("POST", "/compras", { formaPagamento: "pix" }, token);
  assert.equal(status, 400);
});

test("20. GET /compras e GET /compras/:id", async () => {
  const lista = await requisicao("GET", "/compras", null, token);
  assert.equal(lista.status, 200);
  assert.equal(lista.dados.length, 1);
  assert.equal(lista.dados[0].id, compraId);

  const compra = await requisicao("GET", `/compras/${compraId}`, null, token);
  assert.equal(compra.status, 200);
  assert.equal(compra.dados.id, compraId);
  assert.equal(compra.dados.formaPagamento, "pix");
  assert.equal(compra.dados.quantidadeTotal, 2);
  assert.equal(compra.dados.itens[0].produtoId, 1);
});

test("21. Outro usuário não enxerga a compra do primeiro", async () => {
  const outro = { nome: "Joao Teste", email: "joao@teste.com", senha: "123456" };
  await requisicao("POST", "/usuarios", outro);
  const login = await requisicao("POST", "/login", { email: outro.email, senha: outro.senha });

  const { status } = await requisicao("GET", `/compras/${compraId}`, null, login.dados.token);
  assert.equal(status, 404);
});
