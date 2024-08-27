import { Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { AddMessageDto } from './dto/add-message.dto';
import { ChatMessageService } from './chat-message.service';
import {
  ClientKafka,
  // Ctx,
  // KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from 'src/shemas/ChatMessage.schema';

@Controller('chat-message')
export class ChatMessageController {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    @Inject('CHAT_MESSAGE_SERVICE') private readonly clientKafka: ClientKafka,
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessage>,
  ) {}

  async onModuleInit() {
    this.clientKafka.subscribeToResponseOf('chat-topic'); // chat-topic.reply
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
  @Post('/create')
  // @MessagePattern('chat-topic')
  async addChatMessage(@Payload() addMessageDto: AddMessageDto) {
    // console.log(addMessageDto);
    return this.chatMessageService.addNewChatMessage(addMessageDto);
  }
  @Get('/history/:id')
  async historyChatChannelMessage(@Param('id') id: string) {
    return this.chatMessageService.historyChatChannelMessage(id);
  }
}
