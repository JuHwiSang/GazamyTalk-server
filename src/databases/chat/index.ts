import mongodb, { MongoClient, Db, Filter, UpdateFilter } from "mongodb";

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

    async insert(chatInfo: ChatInfo) : Promise<number> {
        let collection = this.db.collection<ChatInfo>(`room-${chatInfo.roomid}`);
        try {
            let result = await collection.insertOne(chatInfo);
            return result.acknowledged ? 1 : 0;
        } catch {
            return 0;
        }
    }

    async update(beforeChatInfo: Partial<Filter<ChatInfo>>, afterChatInfo: Partial<UpdateFilter<ChatInfo>>) : Promise<number> {
        if (beforeChatInfo.roomid === undefined) {
            throw new Error("ChatDBClient.update - beforeChatInfo must receive roomid");
        }
        if (afterChatInfo.roomid !== undefined) {
            throw new Error("ChatDBClient.update - afterChatInfo can't receive roomid");
        }
        let collection = this.db.collection<ChatInfo>(`room-${beforeChatInfo.roomid}`);
        try {
            let result = await collection.updateMany(beforeChatInfo, afterChatInfo);
            return result.matchedCount;
        } catch {
            return 0;
        }
    }
    
    async delete(chatInfo: Partial<Filter<ChatInfo>>) : Promise<number> {
        if (chatInfo.roomid === undefined) {
            throw new Error("ChatDBClient.delete must receive roomid");
        }
        let collection = this.db.collection<ChatInfo>(`room-${chatInfo.roomid}`);
        try {
            let result = await collection.deleteMany(chatInfo);
            return result.deletedCount;
        } catch {
            return 0;
        }
    }
    
    async select(chatInfo: Partial<Filter<ChatInfo>>) : Promise<ChatInfo[]> {
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

    async close() : Promise<void> {
        await this.client.close();
    }
}