import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { CreateTransactionUseCase } from './create-transaction'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { makeClient } from 'test/factories/make-client'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NegativeLimitError } from './errors/negative-limit-error'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let inMemoryClientsRepository: InMemoryClientsRepository

let sut: CreateTransactionUseCase

describe('Create transaction', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository()

    sut = new CreateTransactionUseCase(
      inMemoryTransactionsRepository,
      inMemoryClientsRepository,
    )
  })

  it('should be able to create a c transaction', async () => {
    const client = makeClient()

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
      description: 'asd',
      type: 'c',
      value: 100,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryClientsRepository.items[0].balance).toEqual(
        result.value.client.balance,
      )
    }
  })

  it('should be able to create a d transaction', async () => {
    const client = makeClient()

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
      description: 'asd',
      type: 'd',
      value: 100,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryClientsRepository.items[0].balance).toEqual(
        result.value.client.balance,
      )
    }
  })

  it('should not be able to create a transaction when client does not exist', async () => {
    const result = await sut.execute({
      clientId: 0,
      description: 'asd',
      type: 'd',
      value: 100,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be able to create a d transaction when negative limit is passed', async () => {
    const client = makeClient({
      limit: 1000,
    })

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
      description: 'asd',
      type: 'd',
      value: 1001,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NegativeLimitError)
    }
  })
})
