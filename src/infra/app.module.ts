import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { DatabaseModule } from './database/database.module'
import { EnvService } from './env/env.service'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    DatabaseModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        connectionString: envService.get('POSTGRES_URL'),
        max: envService.get('DB_POOL'),
        idleTimeoutMillis: 0,
        connectionTimeoutMillis: 10000,
      }),
    }),
    HttpModule,
  ],
})
export class AppModule {}
