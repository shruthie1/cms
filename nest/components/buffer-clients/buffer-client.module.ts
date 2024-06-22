import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BufferClientService } from './buffer-client.service';
import { BufferClientController } from './buffer-client.controller';
import { BufferClientSchema } from './schemas/buffer-client.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'bufferClientModule', schema: BufferClientSchema, collection: 'bufferClients' }])],
  controllers: [BufferClientController],
  providers: [BufferClientService],
  exports: [BufferClientService]
})
export class BufferClientModule { }
