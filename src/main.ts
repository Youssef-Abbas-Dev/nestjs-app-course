import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply Middlewares
  app.use(helmet())

  // Cors Policy
  app.enableCors({
    origin: "http://localhost:3000"
  });

  // Swagger
  const swagger = new DocumentBuilder()
  .setTitle("Nest JS Course - App API")
  .setDescription("Your API description")
  .addServer("http://localhost:5000")
  .setTermsOfService("http://localhost:5000/terms-of-service")
  .setLicense("MIT License", "https://google.com")
  .setVersion("1.0")
  .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
  .addBearerAuth()
  .build();
  const documentation = SwaggerModule.createDocument(app,  swagger);
  // http://localhost:5000/swagger
  SwaggerModule.setup("swagger", app, documentation);

  // Running The App
  await app.listen(5000);
}
bootstrap();

