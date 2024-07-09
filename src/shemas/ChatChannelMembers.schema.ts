import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'chat_channel_members' })
export class ChatChannelMembers extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role_id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'ChatChannel' })
  chat_channel_id: Types.ObjectId;
}

export const ChatChannelMembersSchema =
  SchemaFactory.createForClass(ChatChannelMembers);
