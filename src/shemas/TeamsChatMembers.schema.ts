import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'teams_chat_members' })
export class TeamsChatMembers extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  role_id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'TeamsChat' })
  teams_chat_id: Types.ObjectId;
}

export const TeamsChatMembersSchema =
  SchemaFactory.createForClass(TeamsChatMembers);
