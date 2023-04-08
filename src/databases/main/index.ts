import mongoose, { Connection, Model, UpdateQuery, FilterQuery } from "mongoose";

import { UserInfo, createUserInfoModel } from "./models/UserInfo";
import { RoomInfo, createRoomInfoModel } from "./models/RoomInfo";
import { mainDBConfig } from "@config/databases";

export { UserInfo } from "./models/UserInfo";
export { RoomInfo } from "./models/RoomInfo";



export default class MainDBClient {
    private connection: Connection
    private UserInfoModel: Model<UserInfo>
    private RoomInfoModel: Model<RoomInfo>

    constructor(connection: Connection) {
        this.connection = connection
        this.UserInfoModel = createUserInfoModel(this.connection);
        this.RoomInfoModel = createRoomInfoModel(this.connection);
    }

    static async create() : Promise<MainDBClient> {
        return new MainDBClient(await mongoose.createConnection(mainDBConfig.uri))
    }

    async insertUser(userInfo: Partial<UserInfo>) : Promise<number> {
        try {
            const result = await this.UserInfoModel.create(userInfo);
            return 1;
        } catch {
            return 0;
        }
    }

    async updateUser(beforeUserInfo: FilterQuery<Partial<UserInfo>>, afterUserInfo: UpdateQuery<Partial<UserInfo>>) : Promise<number> {
        try {
            const result = await this.UserInfoModel.updateMany(beforeUserInfo, afterUserInfo);
            return result.matchedCount;
        } catch {
            return 0;
        }
    }

    async deleteUser(userInfo: FilterQuery<Partial<UserInfo>>) : Promise<number> {
        try {
            const result = await this.UserInfoModel.deleteMany(userInfo);
            return result.deletedCount;
        } catch {
            return 0;
        }
    }

    async selectUser(userInfo: FilterQuery<Partial<UserInfo>>) : Promise<UserInfo[]> {
        try {
            const result: UserInfo[] = await this.UserInfoModel.find(userInfo);
            return result;
        } catch {
            return [];
        }
    }

    async insertRoom(roomInfo: Partial<RoomInfo>) : Promise<number> {
        try {
            const result = await this.RoomInfoModel.create(roomInfo);
            return 1;
        } catch {
            return 0;
        }
    }

    async updateRoom(beforeRoomInfo: FilterQuery<Partial<RoomInfo>>, afterRoomInfo: UpdateQuery<Partial<RoomInfo>>) : Promise<number> {
        try {
            const result = await this.RoomInfoModel.updateMany(beforeRoomInfo, afterRoomInfo);
            return result.matchedCount;
        } catch {
            return 0;
        }
    }

    async deleteRoom(roomInfo: FilterQuery<Partial<RoomInfo>>) : Promise<number> {
        try {
            const result = await this.RoomInfoModel.deleteMany(roomInfo);
            return result.deletedCount;
        } catch {
            return 0;
        }
    }

    async selectRoom(roomInfo: FilterQuery<Partial<RoomInfo>>) : Promise<RoomInfo[]> {
        try {
            const result: RoomInfo[] = await this.RoomInfoModel.find(roomInfo);
            return result;
        } catch {
            return [];
        }
    }

    async close() : Promise<void> {
        this.connection.close();
    }

}