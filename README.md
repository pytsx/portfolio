# Portfólio orientado a conteúdo

Um portfólio construído com Next.js e Firebase no qual a estrutura pública é criada a partir de páginas de blocos. Em vez de manter seções estáticas, o conteúdo, a navegação, os grupos, as redes sociais e a identidade do site são administrados pela área `/admin`.

## Principais recursos

- Editor de blocos com BlockNote e blocos de callout, YouTube e coleção de páginas.
- Páginas públicas na raiz ou organizadas em grupos recursivos, como `/blog/artigo`.
- Página principal configurável para a rota `/`.
- CRUD administrativo para páginas, grupos, menus, redes sociais e configurações do portfólio.
- Tema claro/escuro com `next-themes`.
- Importação e exportação de documentos JSON, além de schema para uso com LLMs.
- Dados públicos cacheados com Cache Components e cache remoto em deploys compatíveis com Vercel.
- Área administrativa protegida por proxy, cookie `HttpOnly` e allowlist de administradores.

## Stack

- Next.js 16, React 19 e TypeScript
- Firebase Authentication e Firestore
- BlockNote e shadcn/Base UI
- Tailwind CSS
- Vitest e ESLint

## Estrutura

```text
app/
  (public)/                 # Layout e rotas públicas dinâmicas
  (protected)/admin/        # Administração e componentes específicos das rotas
components/
  editor/                   # Editor, blocos e formato de transferência JSON
  ui/                       # Componentes compartilhados de interface
lib/
  auth/                     # Sessão, autorização e DTO de usuário
  pages/ groups/ menu/      # Limites de domínio e repositórios
  socials/ site-settings/   # Entidades públicas configuráveis
proxy.ts                    # Barreira inicial para /admin
```

O diretório `app` não acessa Firebase diretamente. A comunicação com Auth e Firestore fica encapsulada em `lib`.

## Pré-requisitos

- Node.js 20 ou superior
- pnpm 12
- Projeto Firebase com Email/Password habilitado e Firestore configurado

## Configuração local

Instale as dependências:

```bash
pnpm install
```

Crie um arquivo `.env` com as variáveis abaixo. Os valores `NEXT_PUBLIC_*` são a configuração pública do Firebase; não inclua chaves de serviço, senhas ou credenciais administrativas nesse arquivo.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

# E-mails autorizados a acessar /admin, separados por vírgula.
ADMIN_EMAILS=admin@exemplo.com
```

Em produção, configure as mesmas variáveis no painel da Vercel. A ausência de `ADMIN_EMAILS` bloqueia o acesso administrativo por padrão.

## Desenvolvimento

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000). A criação inicial de usuários deve ser feita pelo Firebase Authentication; o cadastro público é desativado.

## Qualidade e build

```bash
pnpm lint
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

## Modelo de conteúdo

### Páginas e grupos

Uma página sem grupo é publicada em `/{slug}`. Uma página em um grupo é publicada no caminho do grupo, por exemplo `/{grupo}/{slug}`. Grupos podem conter outros grupos e funcionam como a árvore de navegação do portfólio.

O bloco **Coleção de páginas** consulta páginas publicadas e oferece filtros por grupo, visibilidade, título e página principal.

### Transferência de blocos

No editor de página, o menu **Ações** oferece:

- **Copiar schema**: copia o schema JSON para uma LLM gerar conteúdo compatível.
- **Importar JSON**: valida e aplica uma lista de blocos ao editor. É necessário salvar a página após importar.
- **Exportar JSON**: baixa os blocos atuais em um arquivo JSON.

## Cache

Menus, páginas, grupos, redes sociais e configurações são dados públicos compartilhados. Eles usam `"use cache: remote"`, `cacheTag()` e `cacheLife("hours")`.

As mutations administrativas chamam `updateTag()` para invalidar os dados atualizados. Em um novo deploy, o cache remoto começa vazio e é preenchido nas primeiras requisições.

## Segurança

- O `proxy.ts` redireciona acessos sem sessão em `/admin/*`.
- A autorização definitiva é repetida no servidor, no acesso aos dados e nas Server Actions; o proxy não é a única barreira.
- A sessão é um cookie `HttpOnly`, `SameSite=Strict` e `Secure` em produção.
- O Firebase no cliente usa persistência em memória, sem gravar token em `localStorage` ou `sessionStorage`.
- Apenas o DTO mínimo do usuário autenticado é enviado à interface.

## Deploy

O projeto pode ser publicado na Vercel. Configure as variáveis de ambiente, faça o deploy e valide o login de um e-mail listado em `ADMIN_EMAILS` antes de disponibilizar a área administrativa.
