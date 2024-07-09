import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatChannel } from 'src/shemas/ChatChannel.schema';
import { ChatChannelMembers } from 'src/shemas/ChatChannelMembers.schema';
import { ChatMessage } from 'src/shemas/ChatMessage.schema';
import { AddMessageDto } from './dto/add-message.dto';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(ChatChannel.name) private chatChannelModel: Model<ChatChannel>,
    @InjectModel(ChatChannelMembers.name)
    private chatChannelMembersModel: Model<ChatChannelMembers>,
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessage>,
  ) {}
  async addNewChatMessage(addMessageDto: AddMessageDto): Promise<ChatMessage> {
    return null;
  }
}
