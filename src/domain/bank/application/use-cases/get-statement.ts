import { Either, left, right } from '@/core/types/either'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { Injectable } from '@nestjs/common'
import { TransactionType } from '@/core/types/transactionType'
import { ClientsRepository } from '../repositories/clients-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface GetStatementUseCaseRequest {
  clientId: number
}

export interface Statement {
  saldo: {
    total: number
    data_extrato: Date
    limite: number
  }
  ultimas_transacoes: Array<{
    valor: number
    tipo: TransactionType
    descricao: string
    realizada_em: Date
  }>
}

type GetStatementUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    statement: Statement
  }
>

@Injectable()
export class GetStatementUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly clientsRepository: ClientsRepository,
  ) {}

  async execute({
    clientId,
  }: GetStatementUseCaseRequest): Promise<GetStatementUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError())
    }

    const transactions =
      await this.transactionsRepository.findMaxTenDescByClientId(clientId)

    const statement: Statement = {
      saldo: {
        limite: client.limit,
        data_extrato: new Date(),
        total: client.balance,
      },
      ultimas_transacoes: transactions.map((transaction) => ({
        valor: transaction.value,
        realizada_em: transaction.createdAt,
        descricao: transaction.description,
        tipo: transaction.type,
      })),
    }

    return right({
      statement,
    })
  }
}
