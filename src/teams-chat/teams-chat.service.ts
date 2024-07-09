import { RemoveMemberChatChannelDto } from './dto/remove-member-chat-channel.dto';
import { AddMemberChatChannelDto } from './dto/add-member-chat-channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat-channel.dto';
import { CreateTeamsChatDto } from './dto/create-teams-chat.dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TeamsChat } from '../shemas/TeamsChat.schema';
import { Project } from 'src/shemas/Project.schema';
import { ChatChannel } from 'src/shemas/ChatChannel.schema';
import { CreateChatChannelDto } from './dto/create-chat-channel.dto';
import { TeamsChatMembers } from 'src/shemas/TeamsChatMembers.schema';
import { ProjectMembersService } from 'src/project-members/project-members.service';
import { ChatChannelMembers } from 'src/shemas/ChatChannelMembers.schema';

@Injectable()
export class TeamsChatService {
  constructor(
    @InjectModel(TeamsChat.name) private teamsChatModel: Model<TeamsChat>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ChatChannel.name) private chatChannelModel: Model<ChatChannel>,
    @InjectModel(TeamsChatMembers.name)
    private teamsChatMembersModel: Model<TeamsChatMembers>,
    @InjectModel(ChatChannelMembers.name)
    private chatChannelMembersModel: Model<ChatChannelMembers>,
    private readonly projectMembersService: ProjectMembersService,
  ) {}
  async createTeamChat(
    createTeamsChatDto: CreateTeamsChatDto,
  ): Promise<TeamsChat> {
    // check project id
    const project = await this.projectModel.findById(
      new Types.ObjectId(createTeamsChatDto.project_id),
    );
    // check teams chat exist
    const checkTeamsChatExist = await this.teamsChatModel.findOne({
      project_id: new Types.ObjectId(createTeamsChatDto.project_id),
    });
    // if project doesnt exist then throw error
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    // if teams chat of a project exist then throw error
    if (checkTeamsChatExist) {
      throw new ConflictException(`Team chat of ${project.name} is exist`);
    }

    // Create a new teams chat
    const newTeamsChat = new this.teamsChatModel({
      name: createTeamsChatDto.name,
      project_id: new Types.ObjectId(createTeamsChatDto.project_id),
    });
    await newTeamsChat.save();

    // Create a default chat channel for the teams chat
    const newGeneralChat = new this.chatChannelModel({
      name: 'General',
      teams_chat_id: new Types.ObjectId(newTeamsChat._id as string),
    });
    await newGeneralChat.save();
    // get list members of project
    const projectMembers = await this.projectMembersService.getMembers(
      createTeamsChatDto.project_id,
    );

    // create teams chat members
    const teamsChatMembers = projectMembers.map((member) => ({
      teams_chat_id: new Types.ObjectId(newTeamsChat._id as string),
      user_id: new Types.ObjectId(member.user_id._id),
      role_id: new Types.ObjectId(member.role_id._id),
    }));
    await this.teamsChatMembersModel.insertMany(teamsChatMembers);

    // create list members for general channel
    const chatChannelMembers = teamsChatMembers.map((member) => ({
      chat_channel_id: new Types.ObjectId(newGeneralChat._id as string),
      user_id: new Types.ObjectId(member.user_id),
      role_id: new Types.ObjectId(member.role_id),
    }));
    await this.chatChannelMembersModel.insertMany(chatChannelMembers);

    return newTeamsChat;
  }

  async createChatChannel(
    createChatChannelDto: CreateChatChannelDto,
  ): Promise<ChatChannel> {
    // check teams chat exist, if exist then allow to create chat channel
    const teamsChat = await this.teamsChatModel.findById(
      createChatChannelDto.teams_chat_id,
    );
    if (!teamsChat) {
      throw new NotFoundException('Team chat not found');
    }
    // check chat channel name exist, if exist then not allow to create chat channel
    const checkChatChannelExist = await this.chatChannelModel.findOne({
      name: createChatChannelDto.name,
      teams_chat_id: new Types.ObjectId(createChatChannelDto.teams_chat_id),
    });
    if (checkChatChannelExist) {
      throw new ConflictException('Chat channel name existed');
    }
    // Get teams chat member by user id and teams_chat_id
    const teamsChatCreatedBy = await this.teamsChatMembersModel.findOne({
      user_id: new Types.ObjectId(createChatChannelDto.created_by),
      teams_chat_id: new Types.ObjectId(createChatChannelDto.teams_chat_id),
    });
    if (!teamsChatCreatedBy) {
      throw new NotFoundException('User is not a member of the team chat');
    }
    // if user doesn't have role to add new chat channel, throw error
    if (
      !teamsChatCreatedBy.role_id.equals(
        new Types.ObjectId('668cf6f807318b085dcc37c5'),
      ) &&
      !teamsChatCreatedBy.role_id.equals(
        new Types.ObjectId('668cf70407318b085dcc37c6'),
      )
    ) {
      throw new ForbiddenException(
        'This user is not allowed to create new chat channel',
      );
    }
    // console.log(new Types.ObjectId(createChatChannelDto.created_by));
    // create new chat channel
    const newChatChannel = new this.chatChannelModel({
      name: createChatChannelDto.name,
      teams_chat_id: new Types.ObjectId(createChatChannelDto.teams_chat_id),
      created_by: new Types.ObjectId(createChatChannelDto.created_by),
    });
    await newChatChannel.save();
    const newMemberChatChannel = new this.chatChannelMembersModel({
      chat_channel_id: new Types.ObjectId(newChatChannel._id as string),
      user_id: new Types.ObjectId(createChatChannelDto.created_by),
      role_id: new Types.ObjectId(teamsChatCreatedBy.role_id),
    });
    await newMemberChatChannel.save();
    return newChatChannel;
    // return null;
  }

  async updateChatChannel(
    id: string,
    updateChatChannelDto: UpdateChatChannelDto,
  ): Promise<ChatChannel> {
    const chatChannelUpdate = await this.chatChannelModel.findById(id);
    if (!chatChannelUpdate) {
      throw new NotFoundException('Chat channel not found');
    }
    const checkChatChannelExist = await this.chatChannelModel.findOne({
      name: updateChatChannelDto.name,
      teams_chat_id: updateChatChannelDto.teams_chat_id,
      _id: { $ne: id }, // Exclude the current channel
    });
    if (checkChatChannelExist) {
      throw new ConflictException('Chat channel name existed');
    }
    return this.chatChannelModel.findByIdAndUpdate(id, updateChatChannelDto, {
      new: true,
    });
  }

  async addMemberChatChannel(
    addMemberChatChannelDto: AddMemberChatChannelDto,
  ): Promise<ChatChannelMembers> {
    const checkMemberExist = await this.chatChannelMembersModel.findOne({
      user_id: new Types.ObjectId(addMemberChatChannelDto.user_id),
      chat_channel_id: new Types.ObjectId(
        addMemberChatChannelDto.chat_channel_id,
      ),
    });
    // console.log(checkMemberExist);
    if (checkMemberExist) {
      throw new ConflictException('Chat channel memeber existed');
    }
    const checkMemberIsValid = await this.teamsChatMembersModel.findOne({
      user_id: new Types.ObjectId(addMemberChatChannelDto.user_id),
    });
    // console.log(checkMemberIsValid);
    if (!checkMemberIsValid) {
      throw new NotFoundException('Member is not valid');
    }
    // add member to chat channel
    const newMemberChatChannel = new this.chatChannelMembersModel({
      chat_channel_id: new Types.ObjectId(
        addMemberChatChannelDto.chat_channel_id,
      ),
      user_id: new Types.ObjectId(addMemberChatChannelDto.user_id),
      role_id: new Types.ObjectId(addMemberChatChannelDto.role_id),
    });
    return await newMemberChatChannel.save();
    // return null;
  }

  async removeMemberChatChannel(
    removeMemberChatChannelDto: RemoveMemberChatChannelDto,
  ): Promise<ChatChannelMembers> {
    const checkMemberExist = await this.chatChannelMembersModel.findOne({
      user_id: new Types.ObjectId(removeMemberChatChannelDto.user_id),
      chat_channel_id: new Types.ObjectId(
        removeMemberChatChannelDto.chat_channel_id,
      ),
    });
    // console.log(checkMemberExist);
    if (!checkMemberExist) {
      throw new ConflictException('Chat channel memeber doesnt exist');
    }
    const deleteMember = await this.chatChannelMembersModel.findOneAndDelete({
      user_id: new Types.ObjectId(removeMemberChatChannelDto.user_id),
      chat_channel_id: new Types.ObjectId(
        removeMemberChatChannelDto.chat_channel_id,
      ),
    });
    return deleteMember;
  }

  async findTeamsChatByUserId(id: string): Promise<TeamsChatMembers[]> {
    const teamsChat = await this.teamsChatMembersModel.find({
      user_id: new Types.ObjectId(id),
    });
    return teamsChat;
  }
  async findMembersByTeamsChatId(teamsChatId: string) {
    try {
      const members = await this.teamsChatMembersModel
        .find({ teams_chat_id: new Types.ObjectId(teamsChatId) })
        .exec();
      // console.log(members);
      return members;
    } catch (error) {
      console.error('Error finding members by teams_chat_id:', error);
      throw error;
    }
  }
  async findMemberChatChannel(
    chatChannel: string,
  ): Promise<ChatChannelMembers[]> {
    try {
      const members = await this.chatChannelMembersModel
        .find({
          chat_channel_id: new Types.ObjectId(chatChannel),
        })
        .exec();
      // console.log(members);
      return members;
    } catch (error) {
      console.error('Error finding members by teams_chat_id:', error);
      throw error;
    }
  }
}
