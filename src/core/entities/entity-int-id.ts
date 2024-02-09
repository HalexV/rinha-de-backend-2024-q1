import { UniqueEntityIntId } from './unique-entity-int-id'

export abstract class EntityIntId<Props> {
  private readonly _id: UniqueEntityIntId

  protected props: Props

  protected constructor(props: Props, id?: UniqueEntityIntId) {
    this.props = props
    this._id = id ?? new UniqueEntityIntId()
  }

  get id() {
    return this._id
  }

  public equals(entity: EntityIntId<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
