import { UniqueEntityIntId } from '@/core/entities/unique-entity-int-id'
import { Client, ClientProps } from '@/domain/bank/enterprise/entities/Client'
import { faker } from '@faker-js/faker'

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityIntId,
) {
  const client = Client.create(
    {
      balance: 0,
      limit: faker.number.int({
        min: 100,
        max: 1000000,
      }),
      ...override,
    },
    id,
  )

  return client
}
