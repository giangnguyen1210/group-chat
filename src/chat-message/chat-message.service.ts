import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatChannel } from 'src/shemas/ChatChannel.schema';
import { ChatChannelMembers } from 'src/shemas/ChatChannelMembers.schema';
import { ChatMessage } from 'src/shemas/ChatMessage.schema';
import { AddMessageDto } from './dto/add-message.dto';
// import { ProducerService } from 'src/kafka/producer.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
// import { partition } from 'rxjs';
@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(ChatChannel.name) private chatChannelModel: Model<ChatChannel>,
    @InjectModel(ChatChannelMembers.name)
    private chatChannelMembersModel: Model<ChatChannelMembers>,
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessage>,
    @Inject('CHAT_MESSAGE_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    const requestPatterns = ['message'];
    requestPatterns.forEach((pattern) => {
      this.kafkaService.subscribeToResponseOf(pattern);
    });
    await this.kafkaService.connect();
  }
  async sendMessage(message: { sender: string; content: string }) {
    await this.kafkaService
      .emit('message', {
        key: 'key1',
        value: JSON.stringify(message),
        partition: 0,
      })
      .toPromise();
  }
  @MessagePattern('message')
  async receiveMessage(
    @Payload() message: { sender: string; content: string },
  ) {
    console.log('Received message from Kafka', message);
    // Phát lại tin nhắn qua Socket.IO
    (global as any).chatGateway.server.emit('message', message);
  }

  async addNewChatMessage(addMessageDto: AddMessageDto): Promise<ChatMessage> {
    console.log(addMessageDto.chat_channel_id);
    const checkChatChannelExist = await this.chatChannelModel.findOne({
      _id: addMessageDto.chat_channel_id,
    });
    if (!checkChatChannelExist) {
      throw new NotFoundException("Chat channel doesn't exist");
    }
    const checkChatChannelMemberExistAndInChatChannel =
      await this.chatChannelMembersModel.findOne({
        user_id: new Types.ObjectId(addMessageDto.created_by),
        chat_channel_id: new Types.ObjectId(addMessageDto.chat_channel_id),
      });
    // console.log(checkChatChannelMemberExistAndInChatChannel);
    if (!checkChatChannelMemberExistAndInChatChannel) {
      throw new NotFoundException("Member doesn't exist in chat channel");
    }
    const newMessage = new this.chatMessageModel({
      message_content: addMessageDto.message_content,
      created_by: new Types.ObjectId(addMessageDto.created_by),
      chat_channel_id: new Types.ObjectId(addMessageDto.chat_channel_id),
    });
    const savedMessage = await newMessage.save();
    // console.log(savedMessage);

    await this.kafkaService
      .emit('chat-topic', {
        key: 'key1',
        value: JSON.stringify(newMessage),
        partition: 0,
      })
      .toPromise();
    // await this.kafkaService
    //   .send('chat-topic-second', {
    //     key: 'key2',
    //     value: JSON.stringify(newMessage),
    //     partition: 1,
    //   })
    //   .toPromise();
    // await this.kafkaService
    //   .send('chat-topic', {
    //     key: 'key2',
    //     value: JSON.stringify(newMessage),
    //     partition: 1,
    //   })
    //   .toPromise();
    // await this.kafkaService
    //   .send('chat-topic-second', {
    //     key: 'key2',
    //     value: JSON.stringify(newMessage),
    //     partition: 1,
    //   })
    //   .toPromise();
    // console.log(res);
    // return savedMessage;
    // return savedMessage;
    return savedMessage;
  }
  async historyChatChannelMessage(
    chat_channel_id: string,
  ): Promise<ChatMessage[]> {
    const checkChatChannelExist = await this.chatMessageModel.findOne({
      chat_channel_id: new Types.ObjectId(chat_channel_id),
    });
    if (!checkChatChannelExist) {
      throw new NotFoundException("Chat channel doesn't exist");
    }
    const historyChat = await this.chatMessageModel
      .find({
        chat_channel_id: new Types.ObjectId(chat_channel_id),
      })
      .sort({ createdAt: -1 });
    return historyChat;
  }
}
