Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Começando

Primeiro, clone o repositório:
```bash
git clone https://github.com/caioalmeida12/artesanato-municipal
cd artesanato-municipal
```

Em seguida, instale as dependências:
```bash
npm install
# ou
yarn install
# ou
pnpm install
# ou
bun install
```

Depois, execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) com seu navegador para ver o resultado.

## Rodando o Seed e Construindo o Prisma

Para rodar o seed e construir o Prisma, execute os seguintes comandos:
```bash
npm run seed
npx prisma generate
```

## Informações de Login

Use as seguintes credenciais para fazer login como cliente:

- Email: usuario1@exemplo.com
- Senha: senha1

Use as seguintes credenciais para fazer login como vendedor:

- Email: usuario2@exemplo.com
- Senha: senha2

## Acessando a Dashboard como Vendedor

1. Faça login com as credenciais fornecidas.
2. No menu, selecione "Dashboard". Você será redirecionado para [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

## Criando um Produto

1. Na Dashboard, vá para a seção "Categorias" e crie uma categoria.
2. Na Dashboard, vá para a seção "Produtos".
3. Clique em "Adicionar Produto".
4. Preencha as informações do produto e clique em "Criar produto".

## Trocando para Usuário

1. Clique em "Sair" na navbar.
2. Faça login novamente com as credenciais de usuário.

## Utilizando a Busca para Achar um Produto

1. Na página inicial, use a barra de busca para procurar pelo produto desejado.

## Adicionando ao Carrinho

1. Encontre o produto desejado.
2. Clique em "Adicionar ao Carrinho" na navbar da página de usuário.

## Confirmando a Compra

1. Vá para o carrinho de compras.
2. Revise os itens no carrinho.
3. Clique em "Confirmar Compra".

## Aceitando a Compra na Dashboard

1. Troque para a Dashboard como Vendedor.
2. Vá para a seção "Pedidos".
3. Encontre o pedido e clique em "Aceitar".

## Verificando Pedidos Confirmados

1. Troque para Usuário.
2. Vá para a seção "Pedidos".
3. Verifique os pedidos confirmados.