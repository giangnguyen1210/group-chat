import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TeamsChatService } from './teams-chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';

@Controller('chat-channel')
export class ChatChannelController {
  constructor(private readonly teamsChatService: TeamsChatService) {}
  @Post()
  @UseGuards(AuthGuard)
  async createChatChannel(@Body() createChatChannelDto: CreateChatChannelDto) {
    return this.teamsChatService.createChatChannel(createChatChannelDto);
  }
}
