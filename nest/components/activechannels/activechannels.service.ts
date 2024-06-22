// src/activechannels/activechannels.service.ts
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateActiveChannelDto } from './dto/create-active-channel.dto';
import { UpdateActiveChannelDto } from './dto/update-active-channel.dto';
import { ActiveChannel } from './schemas/active-channel.schema';
@Injectable()
export class ActiveChannelsService {
  constructor(
    @InjectModel(ActiveChannel.name) private activeChannelModel: Model<ActiveChannel>,
  ) { }

  async create(createActiveChannelDto: CreateActiveChannelDto): Promise<ActiveChannel> {
    const createdChannel = new this.activeChannelModel(createActiveChannelDto);
    return createdChannel.save();
  }

  async findAll(): Promise<ActiveChannel[]> {
    return this.activeChannelModel.find().exec();
  }

  async findOne(channelId: string): Promise<ActiveChannel> {
    const channel = await this.activeChannelModel.findOne({ channelId }).exec();
    return channel;
  }

  async update(channelId: string, updateActiveChannelDto: UpdateActiveChannelDto): Promise<ActiveChannel> {
    const updatedChannel = await this.activeChannelModel.findOneAndUpdate(
      { channelId },
      updateActiveChannelDto,
      { new: true, upsert: true },
    ).exec();
    return updatedChannel;
  }

  async remove(channelId: string): Promise<void> {
    const result = await this.activeChannelModel.findOneAndDelete({ channelId }).exec();
  }

  async search(filter: any): Promise<ActiveChannel[]> {
    console.log(filter)
    return this.activeChannelModel.find(filter).exec();
  }

  async addReactions(channelId: string, reactions: string[]): Promise<ActiveChannel> {
    const channel = await this.activeChannelModel.findOneAndUpdate({ channelId }, {
      $addToSet: { availableMsgs: reactions }
    })
    return channel;
  }

  async getRandomReaction(channelId: string): Promise<string> {
    const channel = await this.activeChannelModel.findOne({ channelId }).exec();
    if (!channel) {
      return undefined;
    }
    if (channel.reactions.length === 0) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * channel.reactions.length);
    return channel.reactions[randomIndex];
  }

  async removeReaction(channelId: string, reaction: string): Promise<ActiveChannel> {
    const channel = await this.activeChannelModel.findOneAndUpdate({ channelId }, {
      $pull: { reactions: reaction }
    })
    return channel;
  }

  async getActiveChannels(limit = 50, skip = 0, keywords = [], notIds = []) {
    const pattern = new RegExp(keywords.join('|'), 'i');
    const notPattern = new RegExp('online|board|class|PROFIT|wholesale|retail|topper|exam|motivat|medico|shop|follower|insta|traini|cms|cma|subject|currency|color|amity|game|gamin|like|earn|popcorn|TANISHUV|bitcoin|crypto|mall|work|folio|health|civil|win|casino|shop|promot|english|invest|fix|money|book|anim|angime|support|cinema|bet|predic|study|youtube|sub|open|trad|cric|quot|exch|movie|search|film|offer|ott|deal|quiz|academ|insti|talkies|screen|series|webser', "i")
    let query = {
      $and: [
        { username: { $ne: null } },
        {
          $or: [
            { title: { $regex: pattern } },
            { username: { $regex: pattern } }
          ]
        },
        {
          username: {
            $not: {
              $regex: "^(" + notIds.map(id => "(?i)" + id?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))?.join("|") + ")$"
            }
          }
        },
        {
          title: { $not: { $regex: notPattern } }
        },
        {
          username: { $not: { $regex: notPattern } }
        },
        {
          sendMessages: false,
          broadcast: false,
          restricted: false
        }
      ]
    };

    const sort: { participantsCount: "desc" } = { participantsCount: "desc" };
    try {
      const result: ActiveChannel[] = await this.activeChannelModel.find(query).sort(sort).skip(skip).limit(limit).exec();
      return result;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  async executeQuery(query: any, sort?: any, limit?: number): Promise<ActiveChannel[]> {
    try {
      if (!query) {
        throw new BadRequestException('Query is invalid.');
      }
      const queryExec = this.activeChannelModel.find(query);
      if (sort) {
        queryExec.sort(sort);
      }

      if (limit) {
        queryExec.limit(limit);
      }

      return await queryExec.exec();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
