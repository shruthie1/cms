import { TelegramService } from './../Telegram/Telegram.service';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { SetupClientQueryDto } from './dto/setup-client.dto';
import { BufferClientService } from '../buffer-clients/buffer-client.service';
import { sleep } from 'telegram/Helpers';
import { UsersService } from '../users/users.service';
import { ArchivedClientService } from '../archived-clients/archived-client.service';
import { fetchNumbersFromString, fetchWithTimeout } from '../../../utils';

@Injectable()
export class ClientService {
    private clientsMap: Map<string, Client> = new Map();
    constructor(@InjectModel(Client.name) private clientModel: Model<ClientDocument>,
        @Inject(forwardRef(() => TelegramService))
        private telegramService: TelegramService,
        private bufferClientService: BufferClientService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => ArchivedClientService))
        private archivedClientService: ArchivedClientService,
    ) { }

    async create(createClientDto: CreateClientDto): Promise<Client> {
        const createdUser = new this.clientModel(createClientDto);
        return createdUser.save();
    }

    async findAll(): Promise<Client[]> {
        const clientMapLength = this.clientsMap.size
        console.log(clientMapLength)
        if (clientMapLength < 3) {
            const results: Client[] = await this.clientModel.find({}).exec();
            for (const client of results) {
                this.clientsMap.set(client.clientId, client)
            }
            return results
        } else {
            return Array.from(this.clientsMap.values())
        }
    }

    async findOne(clientId: string): Promise<Client> {
        const client = this.clientsMap.get(clientId)
        if (client) {
            return client;
        } else {
            const user = await this.clientModel.findOne({ clientId }).exec();
            this.clientsMap.set(clientId, user);
            if (!user) {
                throw new NotFoundException(`Client with ID "${clientId}" not found`);
            }
            return user;
        }
    }

    async update(clientId: string, updateClientDto: Partial<Client>): Promise<Client> {
        delete updateClientDto['_id']
        const updatedUser = await this.clientModel.findOneAndUpdate({ clientId }, { $set: updateClientDto }, { new: true }).exec();
        this.clientsMap.set(clientId, updatedUser);
        if (!updatedUser) {
            throw new NotFoundException(`Client with ID "${clientId}" not found`);
        }
        return updatedUser;
    }

    async remove(clientId: string): Promise<Client> {
        const deletedUser = await this.clientModel.findOneAndDelete({ clientId }).exec();
        if (!deletedUser) {
            throw new NotFoundException(`Client with ID "${clientId}" not found`);
        }
        return deletedUser;
    }

    async search(filter: any): Promise<Client[]> {
        console.log(filter)
        if (filter.firstName) {
            filter.firstName = { $regex: new RegExp(filter.firstName, 'i') }
        }
        console.log(filter)
        return this.clientModel.find(filter).exec();
    }

    async setupClient(clientId: string, setupClientQueryDto: SetupClientQueryDto) {
        const existingClient = await this.findOne(clientId);
        const existingClientMobile = existingClient.mobile
        const existingClientUser = (await this.usersService.search({ mobile: existingClientMobile }))[0];
        await this.telegramService.createClient(existingClientMobile, false, true)
        if (setupClientQueryDto.formalities) {
            await this.telegramService.updateUsername(existingClientMobile, '');
            await sleep(2000)
            await this.telegramService.updatePrivacyforDeletedAccount(existingClientMobile)
            await sleep(2000)
            await this.telegramService.deleteProfilePhotos(existingClientMobile)
            console.log("Formalities finished")
        } else {
            console.log("Formalities skipped")
        }
        const today = (new Date(Date.now())).toISOString().split('T')[0]
        if (setupClientQueryDto.archiveOld) {
            const availableDate = (new Date(Date.now() + (setupClientQueryDto.days * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]
            await this.bufferClientService.create({
                mobile: existingClientMobile,
                createdDate: today,
                availableDate,
                session: existingClientUser.session,
                tgId: existingClientUser.tgId,
            })
            console.log("client Archived")
        } else {
            console.log("client Archive Skipped")
        }

        const query = { availableDate: { $lte: today } }
        const newBufferClient = (await this.bufferClientService.executeQuery(query))[0];
        if (newBufferClient) {
            this.telegramService.setActiveClientSetup({ mobile: newBufferClient.mobile, clientId })
            await this.telegramService.createClient(newBufferClient.mobile);
            const username = (clientId?.match(/[a-zA-Z]+/g)).toString();
            const userCaps = username[0].toUpperCase() + username.slice(1);
            const updatedUsername = await this.telegramService.updateUsername(newBufferClient.mobile, `${userCaps}_Redd`);
            await this.telegramService.updateNameandBio(existingClientMobile, 'Deleted Account', `New Acc: @${updatedUsername}`);
            await this.telegramService.deleteClient(existingClientMobile)
            console.log("client updated");
        } else {
            console.log("Buffer Clients not available")
        }

        const newClientMe = await this.telegramService.getMe(existingClientMobile)
        await this.telegramService.deleteClient(existingClientMobile);
        const archivedClient = await this.archivedClientService.findOne(newBufferClient.mobile)
        if (archivedClient) {
            await this.updateClient(archivedClient.session, newClientMe.phone, newClientMe.username, clientId)
        } else {
            await this.generateNewSession(newBufferClient.mobile)
        }
    }

    async updateClient(session: string, mobile: string, userName: string, clientId: string) {
        await this.update(clientId, { session: session, mobile, userName, mainAccount: userName });
        if (fetchNumbersFromString(clientId) == '2') {
            const client2 = clientId.replace("1", "2")
            await this.update(client2, { mainAccount: userName });
        }
        await this.telegramService.disconnectAll();
        await fetchWithTimeout(`${process.env.uptimeChecker}/forward/updateclient/${clientId}`);
    }

    async generateNewSession(phoneNumber) {
        try {
            console.log("String Generation started");
            await sleep(1000);
            const response = await fetchWithTimeout(`https://tgsignup.onrender.com/login?phone=${phoneNumber}&force=${true}`, { timeout: 15000 }, 1);
            if (response) {
                console.log(`Code Sent successfully`, response);
                // await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent(`Code Sent successfully-${response}-${phoneNumber}`)}`);
            } else {
                console.log(`Failed to send Code-${JSON.stringify(response)}`);
                await sleep(5000);
                await this.generateNewSession(phoneNumber);
            }
        } catch (error) {
            console.log(error)
        }
    }

    async executeQuery(query: any): Promise<any> {
        try {
            if (!query) {
                throw new BadRequestException('Query is invalid.');
            }
            return await this.clientModel.find(query).exec();
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
