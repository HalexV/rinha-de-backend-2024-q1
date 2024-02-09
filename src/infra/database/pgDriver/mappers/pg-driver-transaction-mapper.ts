import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UniqueEntityIntId } from '@/core/entities/unique-entity-int-id'
import { TransactionType } from '@/core/types/transactionType'
import { Transaction } from '@/domain/bank/enterprise/entities/Transaction'

interface PgDriverTransaction {
  id: string
  value: number
  type: TransactionType
  description: string
  created_at: Date
  client_id: number
}

export class PgDriverTransactionMapper {
  static toDomain(raw: PgDriverTransaction): Transaction {
    return Transaction.create(
      {
        clientId: new UniqueEntityIntId(raw.client_id),
        description: raw.description,
        type: raw.type,
        value: raw.value,
        createdAt: raw.created_at,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPgDriver(transaction: Transaction): PgDriverTransaction {
    return {
      id: transaction.id.toString(),
      client_id: transaction.clientId.toValue(),
      description: transaction.description,
      type: transaction.type,
      value: transaction.value,
      created_at: transaction.createdAt,
    }
  }
}
