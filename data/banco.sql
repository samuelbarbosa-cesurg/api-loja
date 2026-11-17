-- Banco da Loja: tabelas e dados iniciais.
-- Roda sempre que a API inicia (veja src/database/conexao.js).
-- CREATE TABLE IF NOT EXISTS não apaga o que já existe, e INSERT OR IGNORE
-- não duplica os dados: se o id já existir, a linha é ignorada.
-- Preços em CENTAVOS: 4990 = R$ 49,90.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL            -- hash do bcrypt, nunca a senha pura
);

CREATE TABLE IF NOT EXISTS categorias (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS formas_pagamento (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco INTEGER NOT NULL CHECK (preco > 0),        -- centavos
  categoria TEXT NOT NULL REFERENCES categorias(id),
  estoque INTEGER NOT NULL CHECK (estoque >= 0),
  imagem TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS itens_carrinho (
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  produto_id INTEGER NOT NULL REFERENCES produtos(id),
  quantidade INTEGER NOT NULL CHECK (quantidade >= 1),
  PRIMARY KEY (usuario_id, produto_id)
);

CREATE TABLE IF NOT EXISTS compras (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  quantidade_total INTEGER NOT NULL,
  total INTEGER NOT NULL,                          -- centavos
  forma_pagamento TEXT NOT NULL REFERENCES formas_pagamento(id),
  status TEXT NOT NULL DEFAULT 'confirmada',
  criada_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS itens_compra (
  compra_id INTEGER NOT NULL REFERENCES compras(id),
  produto_id INTEGER NOT NULL,
  nome TEXT NOT NULL,            -- cópia do momento da compra
  preco INTEGER NOT NULL,        -- cópia do momento da compra
  imagem TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  PRIMARY KEY (compra_id, produto_id)
);

INSERT OR IGNORE INTO categorias (id, nome) VALUES
  ('eletronicos', 'Eletrônicos'),
  ('roupas', 'Roupas'),
  ('casa', 'Casa'),
  ('livros', 'Livros'),
  ('cervejas', 'Cervejas'),
  ('carnes', 'Carnes'),
  ('refrigerantes', 'Refrigerantes'),
  ('chocolates', 'Chocolates'),
  ('cachorro-quente', 'Cachorro-quente');

INSERT OR IGNORE INTO formas_pagamento (id, nome) VALUES
  ('pix', 'Pix'),
  ('cartao', 'Cartão de crédito'),
  ('boleto', 'Boleto');

INSERT OR IGNORE INTO produtos (id, nome, descricao, preco, categoria, estoque, imagem) VALUES
  (1, 'Fone de ouvido Bluetooth', 'Fone sem fio com cancelamento de ruído e bateria para 20 horas.', 19990, 'eletronicos', 15, 'https://loja-api-wheat.vercel.app/imagens/1.jpg'),
  (2, 'Mouse sem fio', 'Mouse ergonômico com receptor USB e ajuste de sensibilidade.', 8990, 'eletronicos', 30, 'https://loja-api-wheat.vercel.app/imagens/2.jpg'),
  (3, 'Teclado mecânico', 'Teclado com switches azuis, iluminação e layout ABNT2.', 29990, 'eletronicos', 8, 'https://loja-api-wheat.vercel.app/imagens/3.jpg'),
  (4, 'Carregador portátil', 'Power bank de 10.000 mAh com duas saídas USB.', 12990, 'eletronicos', 20, 'https://loja-api-wheat.vercel.app/imagens/4.jpg'),
  (5, 'Camiseta básica', 'Camiseta 100% algodão, disponível em várias cores.', 4990, 'roupas', 50, 'https://loja-api-wheat.vercel.app/imagens/5.jpg'),
  (6, 'Moletom com capuz', 'Moletom flanelado com bolso canguru.', 15990, 'roupas', 12, 'https://loja-api-wheat.vercel.app/imagens/6.jpg'),
  (7, 'Boné aba curva', 'Boné ajustável com fecho de metal.', 5990, 'roupas', 25, 'https://loja-api-wheat.vercel.app/imagens/7.jpg'),
  (8, 'Caneca térmica', 'Caneca de inox que mantém a temperatura por até 6 horas.', 6990, 'casa', 40, 'https://loja-api-wheat.vercel.app/imagens/8.jpg'),
  (9, 'Luminária de mesa', 'Luminária LED com três níveis de intensidade.', 11990, 'casa', 10, 'https://loja-api-wheat.vercel.app/imagens/9.jpg'),
  (10, 'Garrafa de água', 'Garrafa reutilizável de 750 ml, livre de BPA.', 3990, 'casa', 60, 'https://loja-api-wheat.vercel.app/imagens/10.jpg'),
  (11, 'Livro de algoritmos', 'Introdução a algoritmos e estruturas de dados com exemplos.', 8990, 'livros', 18, 'https://loja-api-wheat.vercel.app/imagens/11.jpg'),
  (12, 'Livro de React Native', 'Guia prático para criar aplicativos móveis com React Native.', 9990, 'livros', 5, 'https://loja-api-wheat.vercel.app/imagens/12.jpg'),
  (13, 'Cerveja Pilsen long neck', 'Cerveja leve e refrescante, garrafa de 355 ml.', 699, 'cervejas', 48, 'https://loja-api-wheat.vercel.app/imagens/13.jpg'),
  (14, 'Cerveja de trigo', 'Cerveja de trigo estilo alemão, encorpada e aromática, garrafa de 500 ml.', 1590, 'cervejas', 24, 'https://loja-api-wheat.vercel.app/imagens/14.jpg'),
  (15, 'Pack de cerveja com 12 latas', 'Doze latas de 350 ml de cerveja Pilsen.', 4990, 'cervejas', 10, 'https://loja-api-wheat.vercel.app/imagens/15.jpg'),
  (16, 'Picanha', 'Peça de picanha bovina, aproximadamente 1 kg.', 8990, 'carnes', 8, 'https://loja-api-wheat.vercel.app/imagens/16.jpg'),
  (17, 'Costela bovina', 'Costela bovina para assar, aproximadamente 1 kg.', 3990, 'carnes', 15, 'https://loja-api-wheat.vercel.app/imagens/17.jpg'),
  (18, 'Refrigerante de cola', 'Refrigerante sabor cola, garrafa de 2 litros.', 999, 'refrigerantes', 40, 'https://loja-api-wheat.vercel.app/imagens/18.jpg'),
  (19, 'Refrigerante de laranja', 'Refrigerante sabor laranja, garrafa de 2 litros.', 849, 'refrigerantes', 35, 'https://loja-api-wheat.vercel.app/imagens/19.jpg'),
  (20, 'Barra de chocolate ao leite', 'Chocolate ao leite cremoso, barra de 90 g.', 699, 'chocolates', 60, 'https://loja-api-wheat.vercel.app/imagens/20.jpg'),
  (21, 'Chocolate amargo 70%', 'Chocolate com 70% de cacau, barra de 100 g.', 1290, 'chocolates', 30, 'https://loja-api-wheat.vercel.app/imagens/21.jpg'),
  (22, 'Caixa de bombons', 'Caixa com bombons sortidos, 250 g.', 1490, 'chocolates', 3, 'https://loja-api-wheat.vercel.app/imagens/22.jpg'),
  (23, 'Cachorro-quente tradicional', 'Pão, salsicha, molho de tomate, mostarda e ketchup.', 1290, 'cachorro-quente', 20, 'https://loja-api-wheat.vercel.app/imagens/23.jpg'),
  (24, 'Cachorro-quente completo', 'Pão, duas salsichas, purê, milho, ervilha, queijo ralado e batata palha.', 1890, 'cachorro-quente', 15, 'https://loja-api-wheat.vercel.app/imagens/24.jpg');