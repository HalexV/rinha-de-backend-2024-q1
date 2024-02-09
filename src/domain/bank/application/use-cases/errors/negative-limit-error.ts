import { UseCaseError } from '@/core/errors/use-case-error'

export class NegativeLimitError extends Error implements UseCaseError {
  constructor() {
    super('Negative limit passed.')
  }
}
