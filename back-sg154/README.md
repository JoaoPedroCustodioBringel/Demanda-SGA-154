# Backend - Task Manager API

API REST com NestJS para gerenciamento de tarefas.

## Tecnologias

- NestJS + TypeORM + SQLite
- TypeScript
- Class Validator

## Instalação

```bash
npm install
npm run start:dev
```

Servidor: `http://localhost:3000`

## Endpoints

- `GET /tasks` - Lista tarefas
- `GET /tasks/:id` - Busca tarefa
- `POST /tasks` - Cria tarefa
- `PUT /tasks/:id` - Atualiza tarefa
- `DELETE /tasks/:id` - Remove tarefa

## Exemplo

```json
{
  "title": "Minha tarefa",
  "description": "Descrição",
  "dueDate": "2024-12-31",
  "priority": "high",
  "completed": false
}
```
