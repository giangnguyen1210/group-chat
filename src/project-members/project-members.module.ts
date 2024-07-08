import { Module } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectMembers,
  ProjectMembersSchema,
} from 'src/shemas/ProjectMembers.schema';
import { ProjectMembersController } from './project-members.controller';
import { Project, ProjectSchema } from 'src/shemas/Project.schema';
import { User, UserSchema } from 'src/shemas/User.schema';
import { Role, RoleSchema } from 'src/shemas/Role.schema';

@Module({
  providers: [ProjectMembersService],
  imports: [
    MongooseModule.forFeature([
      { name: ProjectMembers.name, schema: ProjectMembersSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [ProjectMembersController],
})
export class ProjectMembersModule {}
