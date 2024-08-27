import { Module } from '@nestjs/common';
import { AppGateway } from './app-gateway';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';

@Module({
  imports: [ChatMessageModule],
  providers: [AppGateway],
})
export class GatewayModule {}
