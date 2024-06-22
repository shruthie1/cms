import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'bufferClients', versionKey: false, autoIndex: true })  // Specify the collection name here
export class BufferClient extends Document {
  @Prop({ required: true, unique: true })
  tgId: string;

  @Prop({ required: true, unique: true })
  mobile: string;
  
  @Prop({ required: true })
  session: string;

  @Prop({ required: true })
  createdDate: string;

  @Prop({ required: true })
  availableDate: string;

  @Prop({ required: true })
  channels: Number;
}

export const BufferClientSchema = SchemaFactory.createForClass(BufferClient);
