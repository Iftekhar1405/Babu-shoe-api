import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CompanyDocument = Company & Document;

@Schema({ timestamps: true })
export class Company {
  @Prop({ required: true, maxlength: 200 })
  name: string;

  @Prop({ required: false })
  logo: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
