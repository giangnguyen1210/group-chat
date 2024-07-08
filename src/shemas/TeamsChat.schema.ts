import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'teams_chat' })
export class TeamsChat extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project_id: Types.ObjectId;
}

export const TeamsChatSchema = SchemaFactory.createForClass(TeamsChat);
