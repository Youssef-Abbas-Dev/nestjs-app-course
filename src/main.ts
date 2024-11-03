import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))

  app.enableCors({
    origin: "http://localhost:3000"
  });

  
  const swagger = new DocumentBuilder()
  .setTitle("Nest JS Course - App API")
  .setDescription("Your API description")
  .addServer("http://localhost:5000")
  .setTermsOfService("http://localhost:5000/terms-of-service")
  .setLicense("MIT License", "https://google.com")
  .setVersion("1.0")
  .build();


  const documentation = SwaggerModule.createDocument(app,  swagger);
  // http://localhost:5000/swagger
  SwaggerModule.setup("swagger", app, documentation);

  await app.listen(5000);
}
bootstrap();

