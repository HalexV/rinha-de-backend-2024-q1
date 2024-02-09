import { Module } from '@nestjs/common'
import { CreateTransactionController } from './controllers/create-transaction.controller'
import { CreateTransactionUseCase } from '@/domain/bank/application/use-cases/create-transaction'
import { GetStatementController } from './controllers/get-statement.controller'
import { GetStatementUseCase } from '@/domain/bank/application/use-cases/get-statement'

@Module({
  controllers: [CreateTransactionController, GetStatementController],
  providers: [CreateTransactionUseCase, GetStatementUseCase],
})
export class HttpModule {}
