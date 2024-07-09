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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: ChatChannel.name, schema: ChatChannelSchema },
      { name: ChatChannelMembers.name, schema: ChatChannelMembersSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  providers: [ChatMessageService],
  controllers: [ChatMessageController],
})
export class ChatMessageModule {}
