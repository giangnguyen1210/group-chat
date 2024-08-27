import { Injectable } from '@nestjs/common';
import { Consumer, ConsumerRunConfig, Kafka } from 'kafkajs';

@Injectable()
export class ConsumerService {
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly consumers: Consumer[] = [];
  async consume(topic: any, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({ groupId: 'chat-topic' });
    console.log(consumer);
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
  async onApplicationShutDown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
