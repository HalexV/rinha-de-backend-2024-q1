import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateTransactionUseCase } from '@/domain/bank/application/use-cases/create-transaction'
import { TransactionTypeArr } from '@/core/types/transactionType'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NegativeLimitError } from '@/domain/bank/application/use-cases/errors/negative-limit-error'

const idParamSchema = z.coerce.number().int().positive()

const paramValidationPipe = new ZodValidationPipe(idParamSchema)

type IdParamSchema = z.infer<typeof idParamSchema>

const createTransactionBodySchema = z.object({
  valor: z.number().int().positive(),
  tipo: z.enum(TransactionTypeArr),
  descricao: z.string().min(1).max(10),
})

type CreateTransactionBodySchema = z.infer<typeof createTransactionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createTransactionBodySchema)

@Controller('/clientes/:id/transacoes')
export class CreateTransactionController {
  constructor(private readonly createTransaction: CreateTransactionUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Param('id', paramValidationPipe) id: IdParamSchema,
    @Body(bodyValidationPipe) body: CreateTransactionBodySchema,
  ) {
    const { valor: value, tipo: type, descricao: description } = body

    const result = await this.createTransaction.execute({
      clientId: id,
      description,
      type,
      value,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NegativeLimitError:
          throw new UnprocessableEntityException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      limite: result.value.client.limit,
      saldo: result.value.client.balance,
    }
  }
}
