import { PipeTransform, UnprocessableEntityException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new UnprocessableEntityException({
          message: 'Validation failed',
          statusCode: 422,
          errors: fromZodError(error),
        })
      }

      throw new UnprocessableEntityException('Validation failed')
    }
  }
}
