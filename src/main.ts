import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { setupSwagger } from './configs'
import { ErrorsInterceptor, TransformInterceptor } from './common/interceptors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get<ConfigService>(ConfigService)

  // CORS
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  })

  // Filters
  app.useGlobalFilters()

  // Interceptors
  app.useGlobalInterceptors(new TransformInterceptor(), new ErrorsInterceptor())

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((error) =>
          error.constraints ? Object.values(error.constraints) : [],
        )

        return new BadRequestException(messages)
      },
    }),
  )

  // Open APIs
  setupSwagger(app, config)

  await app.listen(config.get<number>('PORT') ?? 3000)
  return app.getUrl()
}
void bootstrap().then((url) => {
  console.log(`Server is running on: ${url}`)
})
