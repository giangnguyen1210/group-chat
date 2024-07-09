import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'chat_channel' })
export class ChatChannel extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ type: Types.ObjectId, ref: 'TeamsChat' })
  teams_chat_id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  created_by: Types.ObjectId;
}

export const ChatChannelSchema = SchemaFactory.createForClass(ChatChannel);
