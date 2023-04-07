import mongoose, { Connection, Model } from "mongoose";

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

    async insertUser(userInfo: Partial<UserInfo>) : Promise<boolean> {
        try {
            const result = await this.UserInfoModel.create(userInfo);
            return true;
        } catch {
            return false;
        }
    }

    async updateUser(beforeUserInfo: Partial<UserInfo>, afterUserInfo: Partial<UserInfo>) : Promise<boolean> {
        try {
            const result = await this.UserInfoModel.updateMany(beforeUserInfo, afterUserInfo);
            return true;
        } catch {
            return false;
        }
    }

    async deleteUser(userInfo: Partial<UserInfo>) : Promise<boolean> {
        try {
            const result = await this.UserInfoModel.deleteMany(userInfo);
            return true;
        } catch {
            return false;
        }
    }

    async selectUser(userInfo: Partial<UserInfo>) : Promise<UserInfo[]> {
        try {
            const result: UserInfo[] = await this.UserInfoModel.find(userInfo);
            return result;
        } catch {
            return [];
        }
    }

    async insertRoom(roomInfo: Partial<RoomInfo>) : Promise<boolean> {
        try {
            const result = await this.RoomInfoModel.create(roomInfo);
            return true;
        } catch {
            return false;
        }
    }

    async updateRoom(beforeRoomInfo: Partial<RoomInfo>, afterRoomInfo: Partial<RoomInfo>) : Promise<boolean> {
        try {
            const result = await this.RoomInfoModel.updateMany(beforeRoomInfo, afterRoomInfo);
            return true;
        } catch {
            return false;
        }
    }

    async deleteRoom(roomInfo: Partial<RoomInfo>) : Promise<boolean> {
        try {
            const result = await this.RoomInfoModel.deleteMany(roomInfo);
            return true;
        } catch {
            return false;
        }
    }

    async selectRoom(roomInfo: Partial<RoomInfo>) : Promise<RoomInfo[]> {
        try {
            const result: RoomInfo[] = await this.RoomInfoModel.find(roomInfo);
            return result;
        } catch {
            return [];
        }
    }

}