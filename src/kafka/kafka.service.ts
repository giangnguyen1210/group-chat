import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  constructor(
    @Inject('CHAT_MESSAGE_SERVICE') private readonly clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('chat-topic');
    await this.clientKafka.connect();
  }

  async sendMessage(topic: string, message: any) {
    return this.clientKafka.send(topic, message).toPromise();
  }
}
