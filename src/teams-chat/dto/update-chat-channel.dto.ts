import { IsNotEmpty, IsString } from 'class-validator';
// import { IsUnique } from 'src/commons/decorators/is-unique.decorator';

export class UpdateChatChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  teams_chat_id: string;
}
