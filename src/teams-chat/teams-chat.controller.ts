import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TeamsChatService } from './teams-chat.service';
import { CreateTeamsChatDto } from './dto/create-teams-chat.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('teams-chat')
export class TeamsChatController {
  constructor(private readonly teamsChatService: TeamsChatService) {}
  @Post()
  @UseGuards(AuthGuard)
  async createTeamChat(@Body() createTeamsChatDto: CreateTeamsChatDto) {
    return this.teamsChatService.createTeamChat(createTeamsChatDto);
  }
}
