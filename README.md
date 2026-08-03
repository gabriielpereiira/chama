# CHAMA

Serviços entre vizinhos em Rio Grande/RS.

O CHAMA conecta quem precisa de um serviço com prestadores locais. O cliente publica a tarefa, prestadores enviam orçamentos, e o melhor ganha. Simples, local e sem intermediários.

## Funcionalidades

- Publicação de tarefas com fotos, bairro e orçamento sugerido
- Orçamentos enviados por prestadores com valor e prazo
- Avaliação bidirecional após a conclusão
- 20 categorias de serviço

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS)
- **Supabase** (PostgreSQL, Auth, Storage)
- **Deploy**: Vercel (planejado)

## Como rodar localmente

Pré-requisito: Node.js 20+ instalado.
```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_SUPABASE_URL=COLE_A_URL_DO_PROJETO
NEXT_PUBLIC_SUPABASE_ANON_KEY=COLE_A_CHAVE_ANONIMA
```

As chaves ficam em **Supabase > Project Settings > API**. Nunca suba esse arquivo para o GitHub.

## Roadmap

- [x] Landing page
- [x] Estrutura do banco de dados
- [x] Categorias de serviço
- [ ] Cadastro e login
- [ ] Publicação de tarefas
- [ ] Orçamentos
- [ ] Avaliações
- [ ] PWA (instalável no celular)
- [ ] Publicação nas lojas (Capacitor)

## Licença

MIT
