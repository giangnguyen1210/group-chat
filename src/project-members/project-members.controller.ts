import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('project-members')
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Post()
  async addMember(@Body() addMemberDto: AddMemberDto) {
    return this.projectMembersService.addMember(addMemberDto);
  }

  @Get(':project_id')
  async getMembers(@Param('project_id') project_id: string) {
    return this.projectMembersService.getMembers(project_id);
  }
}
