// swagger.config.ts
import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

export function setupSwagger(
  app: INestApplication,
  config: ConfigService,
): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Send Mail NestJS APIs')
    .addServer(
      `http://localhost:${config.get('PORT')}`,
      `Development API[PORT=${config.get('PORT')}]`,
    )
    .addBearerAuth({
      description: `Please enter token in following format: Bearer <JWT>`,
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  })

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      displayRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'agate',
      },
    },
  })
}
