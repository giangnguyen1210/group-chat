import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'chat_message' })
export class ChatMessage extends Document {
  @Prop({ required: true })
  message_content: string;
  @Prop({ type: Types.ObjectId, ref: 'ChatChannel' })
  chat_channel_id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by: Types.ObjectId;
  created_at: string;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
