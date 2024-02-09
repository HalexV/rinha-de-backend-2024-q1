import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { EnvService } from '@/infra/env/env.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Get Recipient (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule,
        DatabaseModule.forRootAsync({
          imports: [EnvModule],
          inject: [EnvService],
          useFactory: (envService: EnvService) => ({
            connectionString: envService.get('POSTGRES_URL'),
          }),
        }),
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[GET] /clientes/:id/extrato', async () => {
    const clientId = 1

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'd',
        descricao: 'devolva',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'd',
        descricao: 'devolva',
      })

    const response = await request(app.getHttpServer()).get(
      `/clientes/${clientId}/extrato`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      saldo: expect.objectContaining({
        total: 700,
        limite: 100000,
        data_extrato: expect.any(String),
      }),
      ultimas_transacoes: expect.arrayContaining([
        expect.objectContaining({
          valor: 100,
          tipo: 'd',
          descricao: 'devolva',
          realizada_em: expect.any(String),
        }),
        expect.objectContaining({
          valor: 100,
          tipo: 'c',
          descricao: 'receba',
          realizada_em: expect.any(String),
        }),
        expect.objectContaining({
          valor: 100,
          tipo: 'c',
          descricao: 'receba',
          realizada_em: expect.any(String),
        }),
        expect.objectContaining({
          valor: 100,
          tipo: 'c',
          descricao: 'receba',
          realizada_em: expect.any(String),
        }),
        expect.objectContaining({
          valor: 100,
          tipo: 'c',
          descricao: 'receba',
          realizada_em: expect.any(String),
        }),
        expect.objectContaining({
          valor: 100,
          tipo: 'c',
          descricao: 'receba',
          realizada_em: expect.any(String),
        }),
        expect.objectContaining({
          valor: 100,
          tipo: 'c',
          descricao: 'receba',
          realizada_em: expect.any(String),
        }),
        expect.objectContaining({
          valor: 100,
          tipo: 'c',
          descricao: 'receba',
          realizada_em: expect.any(String),
        }),
        expect.objectContaining({
          valor: 100,
          tipo: 'c',
          descricao: 'receba',
          realizada_em: expect.any(String),
        }),
        expect.objectContaining({
          valor: 100,
          tipo: 'd',
          descricao: 'devolva',
          realizada_em: expect.any(String),
        }),
      ]),
    })
  })

  it('should return 404 when client does not exist', async () => {
    const clientId = 6

    const response = await request(app.getHttpServer()).get(
      `/clientes/${clientId}/extrato`,
    )

    expect(response.statusCode).toBe(404)
  })

  it('should return 400 when client id is not a positive integer', async () => {
    let clientId = 0

    const responseA = await request(app.getHttpServer()).get(
      `/clientes/${clientId}/extrato`,
    )

    expect(responseA.statusCode).toBe(422)

    clientId = -1

    const responseB = await request(app.getHttpServer()).get(
      `/clientes/${clientId}/extrato`,
    )

    expect(responseB.statusCode).toBe(422)

    clientId = 1.2

    const responseC = await request(app.getHttpServer()).get(
      `/clientes/${clientId}/extrato`,
    )

    expect(responseC.statusCode).toBe(422)

    clientId = -1.2

    const responseD = await request(app.getHttpServer()).get(
      `/clientes/${clientId}/extrato`,
    )

    expect(responseD.statusCode).toBe(422)

    const clientIdStr = 'asd'

    const responseE = await request(app.getHttpServer()).get(
      `/clientes/${clientIdStr}/extrato`,
    )

    expect(responseE.statusCode).toBe(422)
  })
})
