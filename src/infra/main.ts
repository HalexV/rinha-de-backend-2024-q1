import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { AppClusterService } from './cluster/cluster.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const envService = app.get(EnvService)

  const port = envService.get('APP_PORT')

  console.log(`${process.pid} started`)
  await app.listen(port, '0.0.0.0')
}

AppClusterService.clusterize(bootstrap)
