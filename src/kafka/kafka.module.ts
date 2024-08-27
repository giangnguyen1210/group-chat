// import { Module } from '@nestjs/common';
// // import { ProducerService } from './producer.service';
// // import { ConsumerService } from './consumer.service';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ProducerService } from './producer.service';

// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: 'CHAT_MESAGE_SERVICE',
//         transport: Transport.KAFKA,
//         options: {
//           client: {
//             clientId: 'chat',
//             brokers: ['localhost:9092'], // Thay đổi theo cấu hình Kafka của bạn
//           },
//           consumer: {
//             groupId: 'chat-message', // Thay đổi theo nhu cầu của bạn
//           },
//         },
//       },
//     ]),
//   ],
//   providers: [ProducerService], // Khai báo ProducerService trong providers
//   exports: [ClientsModule, ProducerService],
// })
// export class KafkaModule {}

// kafka.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
// import { Partitioners } from 'kafkajs';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHAT_MESSAGE_SERVICE', // Đảm bảo tên này đúng
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'chat',
            brokers: ['localhost:9092'], // Thay đổi theo cấu hình Kafka của bạn
            // createPartitioner: Partitioners.LegacyPartitioner,
          },
          consumer: {
            groupId: 'chat-message', // Thay đổi theo nhu cầu của bạn
          },
        },
      },
    ]),
  ],
  providers: [ConsumerService], // Khai báo ProducerService trong providers
  exports: [ClientsModule, ConsumerService], // Export ClientsModule và ProducerService
})
export class KafkaModule {}
