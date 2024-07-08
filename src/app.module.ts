import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TeamsChatModule } from './teams-chat/teams-chat.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectMembersModule } from './project-members/project-members.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: 'chat-groups',
    }),
    // MongooseModule.forFeature([
    //   // { name: Project.name, schema: ProjectSchema },
    //   // { name: ProjectMembers.name, schema: ProjectMembersSchema },
    //   // { name: Role.name, schema: RoleSchema },
    //   // { name: TeamsChat.name, schema: TeamsChatSchema },
    //   // { name: ChatChannel.name, schema: ChatChannelSchema },
    // ]),
    ProjectMembersModule,
    TeamsChatModule,
    ChatMessageModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
