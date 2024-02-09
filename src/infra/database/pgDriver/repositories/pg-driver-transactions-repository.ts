import { TransactionsRepository } from '@/domain/bank/application/repositories/transactions-repository'
import { Transaction } from '@/domain/bank/enterprise/entities/Transaction'
import { PgDriverService } from '../pgDriver.service'
import { Injectable } from '@nestjs/common'
import { EnvService } from '@/infra/env/env.service'
import { PgDriverTransactionMapper } from '../mappers/pg-driver-transaction-mapper'

@Injectable()
export class PgDriverTransactionsRepository implements TransactionsRepository {
  private readonly schema: string

  constructor(
    private readonly pgDriver: PgDriverService,
    private readonly envService: EnvService,
  ) {
    this.schema = this.envService.get('DATABASE_SCHEMA')
  }

  async findMaxTenDescByClientId(clientId: number): Promise<Transaction[]> {
    const result = await this.pgDriver.runQuery(
      `
    SELECT * FROM "${this.schema}"."transactions" WHERE client_id=$1 ORDER BY created_at DESC LIMIT 10;
    `,
      [clientId],
    )

    const data = result.rows

    return data.map(PgDriverTransactionMapper.toDomain)
  }

  async create(transaction: Transaction): Promise<void> {
    const data = PgDriverTransactionMapper.toPgDriver(transaction)

    await this.pgDriver.runQuery(
      `
    INSERT INTO "${this.schema}"."transactions" (
      id,
      client_id,
      created_at,
      description,
      type,
      value
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6
    );
    `,
      [
        data.id,
        data.client_id,
        data.created_at,
        data.description,
        data.type,
        data.value,
      ],
    )
  }
}
