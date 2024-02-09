export class UniqueEntityIntId {
  private readonly value: number
  private static nextId: number = 1

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: number) {
    this.value = value ?? UniqueEntityIntId.nextId++
  }

  equals(id: UniqueEntityIntId) {
    return id.toValue() === this.value
  }
}
