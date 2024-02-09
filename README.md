# Rinha BE 2024 - Q1 @HalexViotto/@HalexV

### Tecnologias usadas:

- Node
- Nest
- PG Driver (driver do postgres para node)
- PostgreSQL

### Script

Instalar o projeto:

- npm ci

Rodar local:
É necessário subir o container do banco:

- docker compose -f docker-compose-test-e2e.yml
- npm run start:dev para iniciar a aplicação de forma local

Rodar testes unitários:

- npm run test ou test:watch

Rodar os testes E2E:

- npm run test:e2e

Rodar os containers para o teste:

- npm run build
- docker compose up

Quaisquer alterações no código do projeto precisam ser buildadas com npm run build novamente e apagar as imagens criadas pelo comando de `compose up` com `docker image rm` e os nomes das imagens criadas. A última parte serve para que as imagens sejam geradas do zero novamente contendo as alterações realizadas.
