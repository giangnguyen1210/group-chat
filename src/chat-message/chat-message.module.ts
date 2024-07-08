import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';

@Module({
  providers: [ChatMessageService],
})
export class ChatMessageModule {}
