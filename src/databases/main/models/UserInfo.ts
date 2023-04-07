import mongoose, { Document, Schema, Connection, Model } from "mongoose";

export interface UserInfo {
    userid: number
    username: string
    nickname: string
    description: string
    rooms: number[]
}

const UserInfoSchema = new Schema(
    {
        userid: { type: Number, require: true, unique: true },
        username: { type: String, require: true },
        nickname: { type: String, require: true },
        description: { type: String, require: true },
        rooms: { type: Array<number>, require: true }
    }
)

export function createUserInfoModel(connection: Connection): Model<UserInfo> {
    return connection.model<UserInfo>("UserInfo", UserInfoSchema);
}