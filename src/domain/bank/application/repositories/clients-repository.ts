import { Client } from '../../enterprise/entities/Client'

export abstract class ClientsRepository {
  abstract save(client: Client): Promise<{ rowCount: number }>
  abstract findById(id: number): Promise<Client | null>
}
