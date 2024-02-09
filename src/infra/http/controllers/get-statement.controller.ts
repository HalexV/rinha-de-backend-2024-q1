import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetStatementUseCase } from '@/domain/bank/application/use-cases/get-statement'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'

const idParamSchema = z.coerce.number().int().positive()

const paramValidationPipe = new ZodValidationPipe(idParamSchema)

type IdParamSchema = z.infer<typeof idParamSchema>

@Controller('/clientes/:id/extrato')
export class GetStatementController {
  constructor(private readonly getStatement: GetStatementUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id', paramValidationPipe) id: IdParamSchema) {
    const result = await this.getStatement.execute({
      clientId: id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return result.value.statement
  }
}
