import { CreateTeamsChatDto } from './dto/create-teams-chat.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamsChat } from '../shemas/TeamsChat.schema';
import { Project } from 'src/shemas/Project.schema';
import { ChatChannel } from 'src/shemas/ChatChannel.schema';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';

@Injectable()
export class TeamsChatService {
  constructor(
    @InjectModel(TeamsChat.name) private teamsChatModel: Model<TeamsChat>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ChatChannel.name) private chatChannelModel: Model<ChatChannel>,
  ) {}
  async createTeamChat(
    createTeamsChatDto: CreateTeamsChatDto,
  ): Promise<TeamsChat> {
    const project = await this.projectModel.findById(
      createTeamsChatDto.project_id,
    );
    const checkTeamsChatExist = await this.teamsChatModel.findOne({
      project_id: createTeamsChatDto.project_id,
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (checkTeamsChatExist) {
      throw new ConflictException(`Team chat of ${project.name} is exist`);
    }

    // Create a new teams chat
    const newTeamsChat = new this.teamsChatModel({
      name: createTeamsChatDto.name,
      project_id: createTeamsChatDto.project_id,
    });
    await newTeamsChat.save();

    // Create a default chat channel for the teams chat
    const newGeneralChat = new this.chatChannelModel({
      name: 'General',
      teams_chat_id: newTeamsChat._id,
    });
    await newGeneralChat.save();

    return newTeamsChat;
  }

  async createChatChannel(
    createChatChannelDto: CreateChatChannelDto,
  ): Promise<ChatChannel> {
    const teamsChat = await this.teamsChatModel.findById(
      createChatChannelDto.teams_chat_id,
    );
    if (!teamsChat) {
      throw new NotFoundException('Team chat not found');
    }
    const newTeamsChat = new this.chatChannelModel({
      name: createChatChannelDto.name,
      project_id: createChatChannelDto.teams_chat_id,
    });
    return await newTeamsChat.save();
  }
}
