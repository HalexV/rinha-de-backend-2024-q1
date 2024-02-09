import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UniqueEntityIntId } from '@/core/entities/unique-entity-int-id'
import { Optional } from '@/core/types/optional'
import { TransactionType } from '@/core/types/transactionType'
import { Entity } from 'src/core/entities/entity'

export interface TransactionProps {
  clientId: UniqueEntityIntId
  value: number
  type: TransactionType
  description: string
  createdAt: Date
}

export class Transaction extends Entity<TransactionProps> {
  get clientId() {
    return this.props.clientId
  }

  set clientId(clientId: UniqueEntityIntId) {
    this.props.clientId = clientId
  }

  get value() {
    return this.props.value
  }

  set value(value: number) {
    this.props.value = value
  }

  get type() {
    return this.props.type
  }

  set type(type: TransactionType) {
    this.props.type = type
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get createdAt() {
    return this.props.createdAt
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt
  }

  static create(
    props: Optional<TransactionProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const transaction = new Transaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return transaction
  }
}
