# Action Planner

Base executavel do frontend mobile-first do Action Planner em Next.js, Tailwind CSS e componentes reutilizaveis no estilo shadcn/ui.

## Arquitetura inicial

- App Router para composicao das rotas.
- Modulos organizados por responsabilidade em domain, application, infrastructure e presentation.
- Componentes compartilhados em src/shared para evitar duplicacao de UI e regras visuais.
- Mock repository em memoria para sustentar desenvolvimento desacoplado de backend.

## Estrutura

```text
src/
  app/
  modules/
    actions/
      application/
      domain/
      infrastructure/
      presentation/
  shared/
    layout/
    lib/
    ui/
```

## Comandos

```bash
npm install
npm run dev
```

## Debug no VS Code

Use as configuracoes em .vscode/launch.json para subir o servidor e abrir a aplicacao em <http://localhost:3000>.
