import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { ChatMessage } from 'src/shemas/ChatMessage.schema';

@Injectable()
export class ChatMessageConsumer {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly chatMessageModel: Model<ChatMessage>,
    @Inject('CHAT_MESSAGE_SERVICE') private readonly clientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    console.log('chat-topic');
    this.clientKafka.subscribeToResponseOf('chat-topic'); // chat-topic.reply
    this.clientKafka.subscribeToResponseOf('chat-topic-second'); // chat-topic.reply
    await this.clientKafka.connect();
  }

  @MessagePattern('chat-topic')
  async handleChatMessage(
    @Payload() message: any,
    // @Ctx() context: KafkaContext,
  ): Promise<any> {
    console.log('Received message 1 from Kafka:', message);
    // const mess = context.getConsumer();
    // console.log('mess', mess);
    return message;
  }
  @MessagePattern('chat-topic-second')
  async handleChatSecondMessage(
    @Payload() message: any,
    // @Ctx() context: KafkaContext,
  ): Promise<any> {
    console.log('Received message 2 from Kafka:', message);
    // const mess = context.getConsumer();
    // console.log('mess', mess);
    // const createdMessage = new this.chatMessageModel(message);
    // await createdMessage.save();
    return message;
  }
}
