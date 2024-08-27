import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from 'src/shemas/ChatMessage.schema';
import { JwtModule } from '@nestjs/jwt';
import { ChatChannel, ChatChannelSchema } from 'src/shemas/ChatChannel.schema';
import {
  ChatChannelMembers,
  ChatChannelMembersSchema,
} from 'src/shemas/ChatChannelMembers.schema';
import { ChatMessageController } from './chat-message.controller';
// import { ClientsModule, Transport } from '@nestjs/microservices';
import { ChatMessageConsumer } from './chat-message.consumer';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    KafkaModule,
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: ChatChannel.name, schema: ChatChannelSchema },
      { name: ChatChannelMembers.name, schema: ChatChannelMembersSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
    ClientsModule.register([
      {
        name: 'CHAT_MESSAGE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'chat',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'chat-consumer',
          },
        },
      },
    ]),
  ],
  providers: [ChatMessageService, ChatMessageConsumer],
  controllers: [ChatMessageController],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
