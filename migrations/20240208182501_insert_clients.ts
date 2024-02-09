import { Knex } from 'knex'
import { config } from 'dotenv'

if (!process.env.DATABASE_SCHEMA) {
  config()
}

const schema = process.env.DATABASE_SCHEMA ?? 'public'

export async function up(knex: Knex): Promise<void> {
  await knex(`${schema}.clients`).insert([
    { id: 1, limit: 100000, balance: 0 },
    { id: 2, limit: 80000, balance: 0 },
    { id: 3, limit: 1000000, balance: 0 },
    { id: 4, limit: 10000000, balance: 0 },
    { id: 5, limit: 500000, balance: 0 },
  ])
}

export async function down(knex: Knex): Promise<void> {
  await knex(`${schema}.clients`).del()
}
