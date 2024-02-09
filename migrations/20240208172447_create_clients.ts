import { Knex } from 'knex'
import { config } from 'dotenv'

if (!process.env.DATABASE_SCHEMA) {
  config()
}

const schema = process.env.DATABASE_SCHEMA ?? 'public'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  CREATE TABLE "${schema}"."clients" (
    "id" INT NOT NULL PRIMARY KEY,
    "limit" INT NOT NULL,
    "balance" INT NOT NULL
  );
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
  DROP TABLE "${schema}"."clients";
  `)
}
