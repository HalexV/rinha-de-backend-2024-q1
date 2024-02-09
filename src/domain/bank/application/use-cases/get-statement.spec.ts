import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { makeClient } from 'test/factories/make-client'
import { GetStatementUseCase } from './get-statement'
import { CreateTransactionUseCase } from './create-transaction'
import { setTimeout } from 'timers/promises'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryClientsRepository: InMemoryClientsRepository

let sut: GetStatementUseCase
let createTransactionUseCase: CreateTransactionUseCase

describe('Get statement', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository()

    sut = new GetStatementUseCase(
      inMemoryTransactionsRepository,
      inMemoryClientsRepository,
    )

    createTransactionUseCase = new CreateTransactionUseCase(
      inMemoryTransactionsRepository,
      inMemoryClientsRepository,
    )
  })

  it('should be able to get a statement', async () => {
    const client = makeClient({
      limit: 10000,
    })

    inMemoryClientsRepository.items.push(client)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd1',
      type: 'c',
      value: 100,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd2',
      type: 'd',
      value: 50,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd3',
      type: 'd',
      value: 20,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd4',
      type: 'c',
      value: 200,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd5',
      type: 'c',
      value: 100,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd6',
      type: 'c',
      value: 100,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd7',
      type: 'd',
      value: 50,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd8',
      type: 'd',
      value: 20,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd9',
      type: 'c',
      value: 200,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd10',
      type: 'c',
      value: 100,
    })

    await setTimeout(5)

    await createTransactionUseCase.execute({
      clientId: client.id.toValue(),
      description: 'asd11',
      type: 'c',
      value: 100,
    })

    const result = await sut.execute({
      clientId: client.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.statement).toMatchObject({
        saldo: {
          total: 760,
          limite: 10000,
        },
        ultimas_transacoes: [
          {
            descricao: 'asd11',
          },
          {
            descricao: 'asd10',
          },
          {
            descricao: 'asd9',
          },
          {
            descricao: 'asd8',
          },
          {
            descricao: 'asd7',
          },
          {
            descricao: 'asd6',
          },
          {
            descricao: 'asd5',
          },
          {
            descricao: 'asd4',
          },
          {
            descricao: 'asd3',
          },
          {
            descricao: 'asd2',
          },
        ],
      })
    }
  })
})
