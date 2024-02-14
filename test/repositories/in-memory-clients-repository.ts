import { ClientsRepository } from '@/domain/bank/application/repositories/clients-repository'
import { Client } from '@/domain/bank/enterprise/entities/Client'

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  async findById(id: number): Promise<Client | null> {
    const client = this.items.find((client) => client.id.toValue() === id)

    if (!client) {
      return null
    }

    return client
  }

  async save(client: Client): Promise<{ rowCount: number }> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === client.id.toValue(),
    )

    this.items[itemIndex] = client

    return {
      rowCount: 0,
    }
  }
}
