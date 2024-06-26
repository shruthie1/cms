import { MongoClient, ServerApiVersion, ConnectOptions, ObjectId } from 'mongodb';
import mongoose from 'mongoose';
export class ChannelService {
    static instance;
    client = undefined
    db = undefined;
    users = undefined;
    statsDb = undefined;
    statsDb2 = undefined;
    isConnected = false;

    constructor () {
    }

    static getInstance() {
        if (!ChannelService.instance) {
            ChannelService.instance = new ChannelService();
        }
        return ChannelService.instance;
    }
    static isInstanceExist() {
        return !!ChannelService.instance;
    }

    async connect() {
        if (!this.isConnected) {
            console.log('trying to connect to DB......')
            try {
                await mongoose.connect(process.env.mongouri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1, maxPoolSize: 10 } );
                console.log('Connected to MongoDB');
                this.client = mongoose.connection.getClient()
                this.isConnected = true;
                this.client.on('close', () => {
                    console.log('MongoDB connection closed.');
                    this.isConnected = false;
                });
                this.db = this.client.db("tgclients").collection('channels');
                this.users = this.client.db("tgclients").collection('users');
                this.statsDb = this.client.db("tgclients").collection('stats');
                this.statsDb2 = this.client.db("tgclients").collection('stats2');
                return true;
            } catch (error) {
                console.log(`Error connecting to MongoDB: ${error}`);
                return false;
            }
        } else {
            console.log('MongoConnection ALready Existing');
        }
    }
    async insertChannel(channelData) {
        const {
            title,
            id,
            username,
            megagroup,
            participantsCount,
            restricted,
            broadcast
        } = channelData
        const cannotSendMsgs = channelData.defaultBannedRights?.sendMessages
        if (!cannotSendMsgs && !broadcast) {
            await this.db.updateOne({ channelId: id.toString() }, { $set: { username: username, title, megagroup, participantsCount, broadcast, restricted, sendMessages: channelData.defaultBannedRights?.sendMessages, canSendMsgs: true } }, { upsert: true });
        }
    }
    async getChannels(limit = 50, skip = 0, k) {
        const query = { megagroup: true, username: { $ne: null } };
        const sort = { participantsCount: -1 };
        if (k) {
            query["$or"] = [{ title: { $regex: k, $options: 'i' } }, { username: { $regex: k, $options: 'i' } }]
        }
        const options = { collation: { locale: 'en', strength: 1 } };
        try {
            if (k) {
                await this.db?.createIndex({ title: 'text' }); // Create index on the "title" field for text search
            }
            const result = await this.db
                .find(query, options)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray();

            return result;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async insertContact(contact) {
        const collection = this.client.db("tgclients").collection('contacts');
        await collection.updateOne({ phone: contact.phone }, { $set: contact }, { upsert: true });
    }

    async insertUser(user) {
        const filter = { mobile: user.mobile };
        try {
            const entry = await this.users.updateOne(filter, { $set: user }, { upsert: true });
        } catch (error) {
            console.log(error)
        }
    }

    async updateUser(user, data) {
        const filter = { mobile: user.mobile };
        try {
            const entry = await this.users.updateOne(filter, {
                $set: {
                    ...data
                },
            }, { upsert: true });
        } catch (error) {
            console.log(error)
        }
    }

    async resetPaidUsers() {
        try {
            const collection = this.client.db("tgclients").collection('userData');
            const entry = await collection.updateMany({ $and: [{ payAmount: { $gt: 10 }, totalCount: { $gt: 50 } }] }, {
                $set: {
                    totalCount: 10,
                    limitTime: Date.now()
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    async deleteUser(user) {
        const filter = { mobile: user.mobile };
        try {
            const entry = await this.users.deleteOne(filter);
        } catch (error) {
            console.log(error)
        }
    }

    async getUser(user) {
        const filter = { mobile: user.mobile };
        try {
            const entry = await this.users.findOne(filter);
            return entry
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    async getuserdata(filter) {
        try {
            const collection = this.client.db("tgclients").collection('userData');
            const entry = await collection.findOne(filter);
            return entry
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    async updateUserData(filter, data) {
        try {
            const collection = this.client.db("tgclients").collection('userData');
            const entry = await collection.updateMany(filter, { $set: { ...data } });
            return entry
        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    async getTempUser() {
        try {
            const entry = await this.users.findOne({});
            return entry
        } catch (error) {
            console.log(error)
        }
    }

    async getUsersFullData(limit = 2, skip = 0) {
        const result = await this.users?.find({}).skip(skip).limit(limit).sort({ _id: 1 }).toArray();
        if (result) {
            return result;
        } else {
            return undefined;
        }
    }

    async insertInBufferClients(user) {
        const filter = { mobile: user.mobile };
        try {
            const bufferColl = this.client.db("tgclients").collection('bufferClients');
            await bufferColl.updateOne(filter, { $set: { ...user } }, { upsert: true });
        } catch (error) {
            console.log(error)
        }
    }

    async readBufferClients(filter, limit) {
        const bufferColl = this.client.db("tgclients").collection('bufferClients');
        const query = filter || {};
        const queryWithLimit = limit ? bufferColl.find(query).limit(limit) : bufferColl.find(query);
        const result = await queryWithLimit.toArray();
        if (result?.length > 0) {
            return result;
        } else {
            return [];
        }
    }


    async getOneBufferClient(mobile = null) {
        const bufferColl = this.client.db("tgclients").collection('bufferClients');
        const today = new Date().toISOString().split('T')[0]
        const query = { date: { $lte: today } }
        if (mobile) {
            console.log(mobile)
            query['mobile'] = mobile
        }
        console.log(query)
        const results = await bufferColl.find(query).toArray();
        if (results.length) {
            for (const result of results) {
                if (result) {
                    const alreadyExist = await this.getUserConfig({ number: `+${result.mobile}` });
                    if (!alreadyExist) {
                        return result
                    } else {
                        console.log("removing one already existing client");
                        const entry = await bufferColl.deleteMany({ mobile: result.mobile });
                    }
                } else {
                    return undefined;
                }
            }
        } else {
            console.log("returnimg undefind")
            return undefined
        }
    }

    async deleteBufferClient(user) {
        const filter = { mobile: user.mobile };
        console.log(filter)
        const bufferColl = this.client.db("tgclients").collection('bufferClients');
        try {
            const entry = await bufferColl.deleteOne(filter);
            console.log(entry)
        } catch (error) {
            console.log(error)
        }
    }

    async getNewBufferClients(ids) {
        const cursor = this.users.find({ "mobile": { $nin: ids }, twoFA: { $exists: false } }).sort({ lastActive: 1 }).limit(20);
        return cursor
    }

    async readPromoteStats() {
        const promotColl = this.client.db("tgclients").collection('promoteStats');
        const result = await promotColl.find({}, { projection: { "client": 1, "totalCount": 1, "lastUpdatedTimeStamp": 1, "isActive": 1, "_id": 0 } }).sort({ totalCount: -1 }).toArray();
        if (result.length > 0) {
            return result;
        } else {
            return undefined;
        }
    }

    async checkIfPaidToOthers(chatId, profile) {
        const resp = { paid: 0, demoGiven: 0 };
        try {
            const collection = this.client.db("tgclients").collection('userData');
            const document = await collection.find({ chatId, profile: { $exists: true, "$ne": profile }, payAmount: { $gte: 10 } }).toArray();
            const document2 = await collection.find({ chatId, profile: { $exists: true, "$ne": profile }, demoGiven: true }).toArray();
            if (document.length > 0) {
                resp.paid = document.length
            }
            if (document2.length > 0) {
                resp.demoGiven = document2.length
            }
        } catch (error) {
            console.log(error);
        }
        return resp;
    }


    async readSinglePromoteStats(clientId) {
        const promotColl = this.client.db("tgclients").collection('promoteStats');
        const result = await promotColl.findOne({ client: clientId }, { projection: { "client": 1, "totalCount": 1, "lastUpdatedTimeStamp": 1, "isActive": 1, "_id": 0 } });
        return result
    }

    async readStats() {
        const result = await this.statsDb.find({}).sort({ newUser: -1 })
        if (result) {
            return result.toArray();
        } else {
            return undefined;
        }
    }

    async read(chatId) {
        const result = await this.db.findOne({ chatId });
        if (result) {
            return result;
        } else {
            return undefined;
        }
    }
    async removeOnefromChannel(filter) {
        try {
            await this.db.deleteOne(filter)
        } catch (e) {
            console.log(e)
        }
    }

    async getUsers(limit, skip = 0) {
        const result = await this.users?.find({}, { projection: { firstName: 1, userName: 1, mobile: 1, _id: 0 } }).skip(skip).limit(limit).toArray();
        if (result) {
            return result;
        } else {
            return undefined;
        }
    }

    async getupi(key) {
        const upiDb = this.client.db("tgclients").collection('upi-ids');
        const upiIds = await upiDb.findOne({});
        return upiIds[key] || "lakshmi-69@paytm"
    }

    async getAllUpis() {
        const upiDb = this.client.db("tgclients").collection('upi-ids');
        const upiIds = await upiDb.findOne({});
        return upiIds
    }

    async updateUpis(data) {
        const upiDb = this.client.db("tgclients").collection('upi-ids');
        const upiIds = await upiDb.updateOne({}, { $set: { ...data } });
        return upiIds
    }

    async getBuilds() {
        const buildBd = this.client.db("tgclients").collection('builds');
        const builds = await buildBd.findOne({});
        return builds
    }

    async updateBuilds(data) {
        const buildBd = this.client.db("tgclients").collection('builds');
        const builds = await buildBd.updateOne({}, { $set: { ...data } }, { upsert: true });
        return builds
    }

    async getUserConfig(filter) {
        const clientDb = this.client.db("tgclients").collection('clients');
        const client = await clientDb.findOne(filter);
        return client
    }
    async getUserInfo(filter) {
        const clientDb = this.client.db("tgclients").collection('clients');
        const aggregationPipeline = [
            { $match: filter },
            {
                $project: {
                    "_id": 0,
                    "session": 0,
                    "number": 0,
                    "password": 0,
                }
            }
        ];
        const result = await clientDb.aggregate(aggregationPipeline).toArray();
        return result.length > 0 ? result[0] : null;
    }

    
    async updateUserConfig(filter, data) {
        const upiDb = this.client.db("tgclients").collection('clients');
        const updatedDocument = await upiDb.findOneAndUpdate(filter, { $set: { ...data } }, { returnOriginal: false });
        return updatedDocument.value;
    }

    async readArchivedClients(filter, limit) {
        const bufferColl = this.client.db("tgclients").collection('ArchivedClients');
        const query = filter || {};
        const queryWithLimit = limit ? bufferColl.find(query).limit(limit) : bufferColl.find(query);
        const result = await queryWithLimit.toArray();
        if (result?.length > 0) {
            return result;
        } else {
            return [];
        }
    }

    async insertInAchivedClient(data) {
        const upiDb = this.client.db("tgclients").collection('ArchivedClients');
        const upiIds = await upiDb.updateOne({ number: data.number }, { $set: { ...data } }, { upsert: true });
        return upiIds
    }

    async getInAchivedClient(filter) {
        const upiDb = this.client.db("tgclients").collection('ArchivedClients');
        const upiIds = await upiDb.findOne(filter)
        return upiIds
    }

    async removeOneAchivedClient(filter) {
        const upiDb = this.client.db("tgclients").collection('ArchivedClients');
        const upiIds = await upiDb.deleteOne(filter)
        return upiIds
    }

    async getAllUserClients() {
        const clientDb = this.client.db("tgclients").collection('clients');
        const clients = await clientDb.aggregate([
            {
                $project: {
                    "_id": 0,
                    "session": 0,
                    "number": 0,
                    "password": 0,
                }
            }
        ]).toArray();
        return clients;
    }

    async getTgConfig() {
        const clientDb = this.client.db("tgclients").collection('configuration');
        const client = await clientDb.findOne({ "apiId": "1591339" });
        return client
    }

    async updateTgConfig(data) {
        const upiDb = this.client.db("tgclients").collection('configurations');
        const upiIds = await upiDb.updateOne({}, { $set: { ...data } });
        return upiIds
    }

    async processUsers(limit = undefined, skip = undefined) {
        const weekAgo = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        const cursor = this.users.find({
            $or: [
                { "lastUpdated": { $lt: weekAgo } },
                { "lastUpdated": { $exists: false } }
            ]
        }).limit(limit ? limit : 300).skip(skip ? skip : 0);
        return cursor;
    }

    async clearStats() {
        const result = await this.statsDb.deleteMany({ "payAmount": { $lt: 5 } });
        console.log(result);
    }

    async clearStats2() {
        const result = await this.statsDb2?.deleteMany({});
        console.log(result);
    }

    async reinitPromoteStats() {
        const promotColl = this.client.db("tgclients").collection('promoteStats');
        const users = await this.getAllUserClients();
        for (const user of users) {
            await promotColl.updateOne({ client: user.clientId },
                {
                    $set: {
                        data: Object.fromEntries((await promotColl.findOne({ client: user.clientId })).channels?.map(channel => [channel, 0])),
                        totalCount: 0,
                        uniqueChannels: 0,
                        releaseDay: Date.now(),
                        lastupdatedTimeStamp: Date.now()
                    }
                });
        }
    }

    async closeConnection() {
        try {
            if (this.isConnected) {
                this.isConnected = false;
                console.log('MongoDB connection closed.');
            }
            await this.client?.close();
        } catch (error) {
            console.log(error)
        }
    }

    async getCurrentActiveUniqueChannels() {
        const promoteStatsColl = this.client.db("tgclients").collection('promoteStats');

        const cursor = promoteStatsColl.find({});
        const uniqueChannels = new Set();

        await cursor.forEach((document) => {
            for (const channel in document.data) {
                uniqueChannels.add(channel);
            }
        });

        const uniqueChannelNames = Array.from(uniqueChannels);
        return uniqueChannelNames;
    }
    async setEnv() {
        const clientDb = this.client.db("tgclients").collection('configuration');
        const jsonData = await clientDb.findOne({}, { _id: 0 });
        for (const key in jsonData) {
            console.log('setting', key)
            process.env[key] = jsonData[key];
        }
        console.log("finished setting env");
    }

    async getActiveChannels(limit = 50, skip = 0, keywords = [], notIds = [], collection = 'activeChannels') {
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

        const sort = { participantsCount: -1 };
        const promoteStatsColl = this.client.db("tgclients").collection(collection);
        try {
            const result = await promoteStatsColl
                .find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray();

            return result;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async updateActiveChannels() {
        try {
            const promoteStatsColl = this.client.db("tgclients").collection('promoteStats');
            const activeChannelCollection = this.client.db("tgclients").collection('activeChannels');
            const channelInfoCollection = this.client.db("tgclients").collection('channels');
            const cursor = promoteStatsColl.find({});

            await cursor.forEach(async (document) => {
                for (const channelId in document.data) {
                    const channelInfo = await channelInfoCollection.findOne({ channelId }, { projection: { "_id": 0 } });
                    if (channelInfo) {
                        await activeChannelCollection.updateOne({ channelId }, { $set: channelInfo }, { upsert: true });
                    }
                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    async updateActiveChannel(id, data) {
        const activeChannelCollection = this.client.db("tgclients").collection('activeChannels');
        await activeChannelCollection.updateOne({ channelId: id }, { $set: data }, { upsert: true })
    }

    async removeOnefromActiveChannel(filter) {
        try {
            const activeChannelCollection = this.client.db("tgclients").collection('activeChannels');
            await activeChannelCollection.deleteOne(filter)
        } catch (e) {
            console.log(e)
        }
    }
}
