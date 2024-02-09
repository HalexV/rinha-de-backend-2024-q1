import { Client } from '../../enterprise/entities/Client'

export abstract class ClientsRepository {
  abstract save(client: Client): Promise<void>
  abstract findById(id: number): Promise<Client | null>
}
