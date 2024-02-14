import { Either, left, right } from '@/core/types/either'
import { Client } from '../../enterprise/entities/Client'
import { TransactionsRepository } from '../repositories/transactions-repository'
import { Injectable } from '@nestjs/common'
import { TransactionType } from '@/core/types/transactionType'
import { ClientsRepository } from '../repositories/clients-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NegativeLimitError } from './errors/negative-limit-error'
import { Transaction } from '../../enterprise/entities/Transaction'
import { UniqueEntityIntId } from '@/core/entities/unique-entity-int-id'
import { setTimeout } from 'node:timers/promises'

interface CreateTransactionUseCaseRequest {
  clientId: number
  value: number
  type: TransactionType
  description: string
}

type CreateTransactionUseCaseResponse = Either<
  ResourceNotFoundError | NegativeLimitError,
  {
    client: Client
  }
>

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly clientsRepository: ClientsRepository,
  ) {}

  async execute({
    clientId,
    value,
    type,
    description,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    let rowCount
    let client

    do {
      client = await this.clientsRepository.findById(clientId)

      if (!client) {
        return left(new ResourceNotFoundError())
      }

      if (type === 'd') {
        const balanceResult = client.balance - value

        if (client.limit < balanceResult * -1) {
          return left(new NegativeLimitError())
        }

        client.balance = balanceResult
      }

      if (type === 'c') {
        client.balance += value
      }

      const result = await this.clientsRepository.save(client)

      rowCount = result.rowCount

      if (rowCount <= 0) {
        await setTimeout(0)
      }
    } while (rowCount <= 0)

    const transaction = Transaction.create({
      clientId: new UniqueEntityIntId(clientId),
      description,
      type,
      value,
    })

    await this.transactionsRepository.create(transaction)

    return right({
      client,
    })
  }
}
