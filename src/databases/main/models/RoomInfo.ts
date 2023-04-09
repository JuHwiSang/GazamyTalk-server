import mongoose, { Document, Schema, Connection, Model } from "mongoose";

export interface RoomInfo {
    roomid: number
    roomname: string
    description: string
    users: number[]
}

const RoomInfoSchema = new Schema(
    {
        roomid: { type: Schema.Types.ObjectId, auto: true },
        roomname: { type: String, require: true },
        description: { type: String, require: true },
        users: { type: Array<number>, require: true }
    }
)

export function createRoomInfoModel(connection: Connection): Model<RoomInfo> {
    return connection.model<RoomInfo>("RoomInfo", RoomInfoSchema);
}