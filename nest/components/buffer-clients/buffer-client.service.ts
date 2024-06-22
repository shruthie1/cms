import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBufferClientDto } from './dto/create-buffer-client.dto';
import { BufferClient } from './schemas/buffer-client.schema';

@Injectable()
export class BufferClientService {
    constructor(@InjectModel('bufferClientModule') private bufferClientModel: Model<BufferClient>) { }

    async create(bufferClient: CreateBufferClientDto): Promise<BufferClient> {
        const newUser = new this.bufferClientModel(bufferClient);
        return newUser.save();
    }

    async findAll(): Promise<BufferClient[]> {
        return this.bufferClientModel.find().exec();
    }

    async findOne(mobile: string): Promise<BufferClient> {
        const user = await this.bufferClientModel.findOne({ mobile }).exec();
        if (!user) {
            throw new NotFoundException(`BufferClient with mobile ${mobile} not found`);
        }
        return user;
    }

    async update(mobile: string, user: Partial<BufferClient>): Promise<BufferClient> {
        delete user['_id']
        const existingUser = await this.bufferClientModel.findOneAndUpdate({ mobile }, { user }, { new: true }).exec();
        if (!existingUser) {
            throw new NotFoundException(`BufferClient with mobile ${mobile} not found`);
        }
        return existingUser;
    }

    async remove(mobile: string): Promise<void> {
        const result = await this.bufferClientModel.deleteOne({ mobile }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`BufferClient with mobile ${mobile} not found`);
        }
    }
    async search(filter: any): Promise<BufferClient[]> {
        console.log(filter)
        if (filter.firstName) {
            filter.firstName = { $regex: new RegExp(filter.firstName, 'i') }
        }
        console.log(filter)
        return this.bufferClientModel.find(filter).exec();
    }

    async executeQuery(query: any): Promise<any> {
        try {
            if (!query) {
                throw new BadRequestException('Query is invalid.');
            }
            return await this.bufferClientModel.find(query).exec();
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
