import { EntityIntId } from '@/core/entities/entity-int-id'
import { UniqueEntityIntId } from '@/core/entities/unique-entity-int-id'

export interface ClientProps {
  limit: number
  balance: number
  version: number
}

export class Client extends EntityIntId<ClientProps> {
  get limit() {
    return this.props.limit
  }

  set limit(limit: number) {
    this.props.limit = limit
  }

  get balance() {
    return this.props.balance
  }

  set balance(balance: number) {
    this.props.balance = balance
  }

  get version() {
    return this.props.version
  }

  set version(version: number) {
    this.props.version = version
  }

  static create(props: ClientProps, id?: UniqueEntityIntId) {
    const client = new Client(props, id)

    return client
  }
}
