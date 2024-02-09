import { Knex } from 'knex'
import { config } from 'dotenv'

if (!process.env.DATABASE_SCHEMA) {
  config()
}

const schema = process.env.DATABASE_SCHEMA ?? 'public'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  CREATE TYPE "${schema}"."type_enum" AS ENUM ('c', 'd');
  CREATE TABLE "${schema}"."transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" INT NOT NULL,
    "type" "${schema}"."type_enum" NOT NULL,
    "description" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" INT NOT NULL,

    CONSTRAINT "transactions_client_id_fkey" FOREIGN KEY("client_id") REFERENCES "${schema}"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE

  );
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
  DROP TABLE "${schema}"."notifications";
  DROP TYPE "${schema}"."type_enum";
  `)
}
