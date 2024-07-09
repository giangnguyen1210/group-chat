import { IsNotEmpty } from 'class-validator';

export class AddMessageDto {
  @IsNotEmpty()
  chat_channel_id: string;
  @IsNotEmpty()
  created_by: string;
  @IsNotEmpty()
  message_content: string;
  created_at: string;
}
