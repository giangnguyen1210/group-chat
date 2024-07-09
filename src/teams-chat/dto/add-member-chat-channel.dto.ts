import { IsNotEmpty } from 'class-validator';

export class AddMemberChatChannelDto {
  @IsNotEmpty()
  chat_channel_id: string;
  @IsNotEmpty()
  user_id: string;
  @IsNotEmpty()
  role_id: string;
}
