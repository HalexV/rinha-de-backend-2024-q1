import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { EnvModule } from '@/infra/env/env.module'
import { EnvService } from '@/infra/env/env.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Transaction (E2E)', () => {
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

  test('[POST] /clientes/:id/transacoes', async () => {
    const clientId = 1

    const response = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      limite: 100000,
      saldo: 100,
    })

    await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'd',
        descricao: 'devolva',
      })
  })

  it('should return 404 when client does not exist', async () => {
    const clientId = 6

    const response = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(response.statusCode).toBe(404)
  })

  it('should return 400 when client id is not a positive integer', async () => {
    let clientId = 0

    const responseA = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseA.statusCode).toBe(422)

    clientId = -1

    const responseB = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseB.statusCode).toBe(422)

    clientId = 1.2

    const responseC = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseC.statusCode).toBe(422)

    clientId = -1.2

    const responseD = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseD.statusCode).toBe(422)

    const clientIdStr = 'asd'

    const responseE = await request(app.getHttpServer())
      .post(`/clientes/${clientIdStr}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseE.statusCode).toBe(422)
  })

  it('should return 400 when valor is not a positive integer', async () => {
    const clientId = 1

    const responseA = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 0,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseA.statusCode).toBe(422)

    const responseB = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100.1,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseB.statusCode).toBe(422)

    const responseC = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: -100.1,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseC.statusCode).toBe(422)

    const responseD = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: -100,
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseD.statusCode).toBe(422)

    const responseE = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        tipo: 'c',
        descricao: 'receba',
      })

    expect(responseE.statusCode).toBe(422)
  })

  it('should return 400 when tipo is not c or d', async () => {
    const clientId = 1

    const responseA = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'a',
        descricao: 'receba',
      })

    expect(responseA.statusCode).toBe(422)

    const responseB = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 1,
        descricao: 'receba',
      })

    expect(responseB.statusCode).toBe(422)

    const responseC = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'ca',
        descricao: 'receba',
      })

    expect(responseC.statusCode).toBe(422)

    const responseD = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'dd',
        descricao: 'receba',
      })

    expect(responseD.statusCode).toBe(422)

    const responseE = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        descricao: 'receba',
      })

    expect(responseE.statusCode).toBe(422)
  })

  it('should return 400 when descricao is not a string with 1 up to 10 characters', async () => {
    const clientId = 1

    const responseA = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: '',
      })

    expect(responseA.statusCode).toBe(422)

    const responseB = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: 'abcdefghijk',
      })

    expect(responseB.statusCode).toBe(422)

    const responseC = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
      })

    expect(responseC.statusCode).toBe(422)

    const responseD = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100,
        tipo: 'c',
        descricao: null,
      })

    expect(responseD.statusCode).toBe(422)
  })

  it('should return 422 when balance could be inconsistent', async () => {
    const clientId = 1

    const response = await request(app.getHttpServer())
      .post(`/clientes/${clientId}/transacoes`)
      .send({
        valor: 100001,
        tipo: 'd',
        descricao: 'devolva',
      })

    expect(response.statusCode).toBe(422)
  })
})
