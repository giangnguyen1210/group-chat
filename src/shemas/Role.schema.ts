import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'roles' })
export class Role extends Document {
  @Prop({ unique: true, required: true })
  name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
