import { ClientsRepository } from '@/domain/bank/application/repositories/clients-repository'
import { Client } from '@/domain/bank/enterprise/entities/Client'
import { PgDriverService } from '../pgDriver.service'
import { Injectable } from '@nestjs/common'
import { EnvService } from '@/infra/env/env.service'
import { PgDriverClientMapper } from '../mappers/pg-driver-client-mapper'

@Injectable()
export class PgDriverClientsRepository implements ClientsRepository {
  private readonly schema: string

  constructor(
    private readonly pgDriver: PgDriverService,
    private readonly envService: EnvService,
  ) {
    this.schema = this.envService.get('DATABASE_SCHEMA')
  }

  async findById(id: number): Promise<Client | null> {
    const result = await this.pgDriver.runQuery(
      `
    SELECT * FROM "${this.schema}"."clients" WHERE id=$1 LIMIT 1;
    `,
      [id],
    )

    const data = result.rows[0]

    if (!data) return null

    return PgDriverClientMapper.toDomain(data)
  }

  async save(client: Client): Promise<void> {
    const data = PgDriverClientMapper.toPgDriver(client)

    await this.pgDriver.runQuery(
      `
    UPDATE "${this.schema}"."clients" SET 
      "balance" = $2,
      "limit" = $3
    
    WHERE id=$1;
    `,
      [data.id, data.balance, data.limit],
    )
  }
}
