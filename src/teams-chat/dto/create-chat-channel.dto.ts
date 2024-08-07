import { IsNotEmpty, IsString } from 'class-validator';
// import { IsUnique } from 'src/commons/decorators/is-unique.decorator';

export class CreateChatChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  teams_chat_id: string;
  @IsNotEmpty()
  created_by: string;
}
