import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TeamsChatService } from './teams-chat.service';
import { CreateTeamsChatDto } from './dto/create-teams-chat.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('teams-chat')
@UseGuards(AuthGuard)
export class TeamsChatController {
  constructor(private readonly teamsChatService: TeamsChatService) {}
  @Post()
  async createTeamChat(@Body() createTeamsChatDto: CreateTeamsChatDto) {
    return this.teamsChatService.createTeamChat(createTeamsChatDto);
  }
  @Get('/list-member/:id')
  async listMemberByTeamsChatId(@Param('id') id: string) {
    return await this.teamsChatService.findMembersByTeamsChatId(id);
  }
  // @Get('/find-by-teams-chat-id/:id')
  // async findByTeamsChatId(@Param('id') id: string) {
  //   return await this.teamsChatService.findMembersByTeamsChatId(id);
  // }
  @Get('/list-teams-chat-by-user-id/:id')
  async findByUserId(@Param('id') id: string) {
    return await this.teamsChatService.findTeamsChatByUserId(id);
  }
}
