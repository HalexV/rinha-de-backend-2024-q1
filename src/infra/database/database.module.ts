import { Global, Module } from '@nestjs/common'
import {
  CONNECTION_POOL,
  ConfigurableDatabaseModule,
  DATABASE_OPTIONS,
} from './pgDriver/database.module-definition'
import { PgDriverService } from './pgDriver/pgDriver.service'
import { DatabaseOptions } from './pgDriver/databaseOptions'
import { Pool } from 'pg'
import { PgDriverTransactionsRepository } from './pgDriver/repositories/pg-driver-transactions-repository'
import { ClientsRepository } from '@/domain/bank/application/repositories/clients-repository'
import { PgDriverClientsRepository } from './pgDriver/repositories/pg-driver-clients-repository'
import { TransactionsRepository } from '@/domain/bank/application/repositories/transactions-repository'

@Global()
@Module({
  providers: [
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        return new Pool({
          connectionString: databaseOptions.connectionString,
          max: databaseOptions.max,
          idleTimeoutMillis: databaseOptions.idleTimeoutMillis,
          connectionTimeoutMillis: databaseOptions.connectionTimeoutMillis,
        })
      },
    },
    PgDriverService,
    {
      provide: ClientsRepository,
      useClass: PgDriverClientsRepository,
    },
    {
      provide: TransactionsRepository,
      useClass: PgDriverTransactionsRepository,
    },
  ],
  exports: [PgDriverService, ClientsRepository, TransactionsRepository],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
