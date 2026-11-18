import express from "express";
import { fileURLToPath } from "node:url";
import { autenticar } from "./middlewares/autenticar.js";
import * as usuariosController from "./controllers/usuariosController.js";
import * as statusApiController from "./controllers/statusApiController.js";
import * as produtosController from "./controllers/produtosController.js";
import * as categoriasController from "./controllers/categoriasController.js";
import * as formasPagamentoController from "./controllers/formasPagamentoController.js";
import * as carrinhoController from "./controllers/carrinhoController.js";




if (!process.env.JWT_SECRET) {
  console.error("Falta o JWT_SECRET no arquivo .env");
  process.exit(1);
}

const app = express();
app.use("/app", express.static("public"));

const PORTA = Number(process.env.PORT || 3000);



app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PATCH,DELETE");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (request.method === "OPTIONS") return response.sendStatus(204);
  next();
});
app.use(express.json());

app.get("/produtos", autenticar, produtosController.listarProdutos);
app.get("/produtos/:id", autenticar, produtosController.buscarPorId);
app.get("/categorias", autenticar, categoriasController.listarCategorias);
app.get("/formas-pagamento", autenticar, formasPagamentoController.listarFormasPagamento);
app.get("/carrinho", autenticar, carrinhoController.listarCarrinho);
app.post("/carrinho/itens", autenticar, carrinhoController.adicionarItem);
app.patch("/carrinho/itens/:produtoId", autenticar, carrinhoController.atualizarQuantidade);
app.delete("/carrinho/itens/:produtoId", autenticar, carrinhoController.removerItem);
app.get("/", statusApiController.verificarStatusApi);
app.get("/status", statusApiController.verificarStatusApi);
app.post("/usuarios", usuariosController.cadastrar);
app.post("/login", usuariosController.login);

app.use((req, res, next) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    status: 404
  });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORTA, () => {
    console.log(`API disponível em http://localhost:${PORTA}`);
  });
}

export default app;