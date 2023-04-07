import mongodb, { MongoClient, Db } from "mongodb";

import { chatDBConfig } from "@config/databases";
import { ChatInfo } from "./models/ChatInfo";

export { ChatInfo } from "./models/ChatInfo";



export default class ChatDBClient {
    private client: MongoClient;
    private db: Db;

    constructor (client: MongoClient) {
        this.client = client
        this.db = client.db();
    }

    static async create() : Promise<ChatDBClient> {
        return new ChatDBClient(await MongoClient.connect(chatDBConfig.uri));
    }

    async insert(chatInfo: ChatInfo) : Promise<boolean> {
        let collection = this.db.collection<ChatInfo>(`room-${chatInfo.roomid}`);
        try {
            let result = await collection.insertOne(chatInfo);
            return result.acknowledged === true;
        } catch {
            return false;
        }
    }

    async update(beforeChatInfo: Partial<ChatInfo>, afterChatInfo: Partial<ChatInfo>) : Promise<boolean> {
        if (beforeChatInfo.roomid === undefined) {
            throw new Error("ChatDBClient.update - beforeChatInfo must receive roomid");
        }
        if (afterChatInfo.roomid !== undefined) {
            throw new Error("ChatDBClient.update - afterChatInfo can't receive roomid");
        }
        let collection = this.db.collection<ChatInfo>(`room-${beforeChatInfo.roomid}`);
        try {
            let result = await collection.updateMany(beforeChatInfo, { $set: afterChatInfo });
            return result.acknowledged === true;
        } catch {
            return false;
        }
    }
    
    async delete(chatInfo: Partial<ChatInfo>) : Promise<boolean> {
        if (chatInfo.roomid === undefined) {
            throw new Error("ChatDBClient.delete must receive roomid");
        }
        let collection = this.db.collection<ChatInfo>(`room-${chatInfo.roomid}`);
        try {
            let result = await collection.deleteMany(chatInfo);
            return result.acknowledged === true;
        } catch {
            return false;
        }
    }
    
    async select(chatInfo: Partial<ChatInfo>) : Promise<ChatInfo[]> {
        if (chatInfo.roomid === undefined) {
            throw new Error("ChatDBClient.select must receive roomid");
        }
        let collection = this.db.collection<ChatInfo>(`room-${chatInfo.roomid}`);
        try {
            let result = await collection.find(chatInfo).toArray();
            return result;
        } catch {
            return [];
        }
    }
}