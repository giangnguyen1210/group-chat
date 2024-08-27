// // producer.service.ts
// import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
// import { ClientKafka } from '@nestjs/microservices';

// @Injectable()
// export class ProducerService implements OnModuleInit {
//   constructor(
//     @Inject('CHAT_MESSAGE_SERVICE') private readonly kafkaService: ClientKafka, // Đảm bảo inject đúng tên dịch vụ
//   ) {}

//   async onModuleInit() {
//     // Subscribing to topics
//     this.kafkaService.subscribeToResponseOf('chat-topic');
//     await this.kafkaService.connect();
//   }

//   async sendMessage(topic: string, message: any) {
//     return this.kafkaService.send(topic, message);
//   }
// }
