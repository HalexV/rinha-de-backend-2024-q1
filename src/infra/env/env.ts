import { z } from 'zod'

export const envSchema = z.object({
  APP_PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.string().url(),
  DATABASE_SCHEMA: z.string().default('public'),
  CLUSTER: z
    .string()
    .transform((value) => {
      if (
        !value ||
        value.toLowerCase() === 'false' ||
        value.toLowerCase() !== 'true'
      ) {
        return false
      }

      return true
    })
    .optional(),
  CLUSTER_WORKERS: z.coerce.number().default(1),
  DB_POOL: z.coerce.number().default(3),
})

export type Env = z.infer<typeof envSchema>
