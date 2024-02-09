import { TransactionsRepository } from '@/domain/bank/application/repositories/transactions-repository'
import { Transaction } from '@/domain/bank/enterprise/entities/Transaction'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []

  async create(transaction: Transaction): Promise<void> {
    this.items.push(transaction)
  }

  async findMaxTenDescByClientId(clientId: number): Promise<Transaction[]> {
    return this.items
      .filter((transaction) => transaction.clientId.toValue() === clientId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
  }
}
