import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as paginate from 'mongoose-paginate-v2'
import { HydratedDocument } from 'mongoose'
import { UserStatus } from '../enums'

export type UserDocument = HydratedDocument<User>

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ type: String, required: false, unique: true, sparse: true })
  email?: string

  @Prop({ type: String, required: false, select: false })
  hashedPassword?: string

  @Prop({ type: String, required: false, default: UserStatus.INACTIVE })
  status?: UserStatus
}

export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(paginate)
