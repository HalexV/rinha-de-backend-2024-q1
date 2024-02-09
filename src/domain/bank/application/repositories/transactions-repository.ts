import { Transaction } from '../../enterprise/entities/Transaction'

export abstract class TransactionsRepository {
  abstract create(transaction: Transaction): Promise<void>
  abstract findMaxTenDescByClientId(clientId: number): Promise<Transaction[]>
}
