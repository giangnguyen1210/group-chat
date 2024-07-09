import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TeamsChatService } from './teams-chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
import { AddMemberChatChannelDto } from './dto/add-member-chat-channel.dto';
import { RemoveMemberChatChannelDto } from './dto/remove-member-chat-channel.dto';

@Controller('chat-channel')
@UseGuards(AuthGuard)
export class ChatChannelController {
  constructor(private readonly teamsChatService: TeamsChatService) {}
  @Post('/create')
  async createChatChannel(@Body() createChatChannelDto: CreateChatChannelDto) {
    return this.teamsChatService.createChatChannel(createChatChannelDto);
  }
  @Post('/add-member')
  async addMember(@Body() addMemberChatChannelDto: AddMemberChatChannelDto) {
    return this.teamsChatService.addMemberChatChannel(addMemberChatChannelDto);
  }

  @Put('/update/:id')
  async updateChatChannel(
    @Param('id') id: string,
    @Body() updateChatChannelDto: UpdateChatChannelDto,
  ) {
    return await this.teamsChatService.updateChatChannel(
      id,
      updateChatChannelDto,
    );
  }
  @Get('/member/:id')
  async findMemberChatChannel(@Param('id') id: string) {
    return await this.teamsChatService.findMemberChatChannel(id);
  }

  @Delete('/remove-member')
  async removeMemberChatChannel(
    @Body()
    removeMemberChatChannel: RemoveMemberChatChannelDto,
  ) {
    return await this.teamsChatService.removeMemberChatChannel(
      removeMemberChatChannel,
    );
  }
}
