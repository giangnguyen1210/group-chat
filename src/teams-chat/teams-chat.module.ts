import { Module } from '@nestjs/common';
import { TeamsChatController } from './teams-chat.controller';
import { TeamsChatService } from './teams-chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsChat, TeamsChatSchema } from 'src/shemas/TeamsChat.schema';
import { Project, ProjectSchema } from 'src/shemas/Project.schema';
import { ChatChannel, ChatChannelSchema } from 'src/shemas/ChatChannel.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ChatChannelController } from './chat-channel.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamsChat.name, schema: TeamsChatSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ChatChannel.name, schema: ChatChannelSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  controllers: [TeamsChatController, ChatChannelController],
  providers: [TeamsChatService, AuthGuard],
})
export class TeamsChatModule {}
