import { UniqueEntityIntId } from '@/core/entities/unique-entity-int-id'
import { Client } from '@/domain/bank/enterprise/entities/Client'

interface PgDriverClient {
  id: number
  limit: number
  balance: number
  version: number
}

export class PgDriverClientMapper {
  static toDomain(raw: PgDriverClient): Client {
    return Client.create(
      {
        balance: raw.balance,
        limit: raw.limit,
        version: raw.version,
      },
      new UniqueEntityIntId(raw.id),
    )
  }

  static toPgDriver(client: Client): PgDriverClient {
    return {
      id: client.id.toValue(),
      balance: client.balance,
      limit: client.limit,
      version: client.version,
    }
  }
}
