import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'chat',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'chat-consumer',
      },
      run: {
        autoCommit: false,
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
    }),
  );

  app.enableCors({
    origin: 'http://127.0.0.1:5500', // Add your client URL here
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.startAllMicroservices();
  await app.listen(3000); // Cổng mặc định cho ứng dụng chính NestJS
}

bootstrap();
