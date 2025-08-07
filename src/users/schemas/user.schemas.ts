import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Role } from "../../common/enums/role.enum";

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_: Document, ret: any) => {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  _id?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    match: /^[+]?[1-9][\d]{0,15}$/,
  })
  phoneNumber: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({
    type: String,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ phoneNumber: 1 }, { unique: true });
