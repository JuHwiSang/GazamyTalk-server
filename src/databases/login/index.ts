import mysql, { FieldPacket, RowDataPacket, OkPacket } from "mysql2/promise";
import { loginDBConfig } from "@config/databases";


export interface LoginData {
    userid: number
    username: string
    password: string
}

interface LoginDBResultData extends RowDataPacket, LoginData {};

function isAllowedString(value: string) : boolean {
    return value.match(/[^A-za-z0-9_]/) === null;
}

const alternativeFields = { password: "ACCESS DENIED" };
function removeBlockedFields(loginData: LoginData) {
    return {...loginData, ...alternativeFields};
}

function keys2query(keys: string[], pwIndex?: number, delimiter?: string) : string {
    return keys.map((value, index) => pwIndex === index ? `${value}=SHA2(?, 256)` : `${value}=?`).join(delimiter ?? " and ");
}



export default class LoginDBClient {
    private connection: mysql.Connection;
    
    constructor(connection: mysql.Connection) {
        this.connection = connection;
    }


    static async create(): Promise<LoginDBClient> {
        return new LoginDBClient(await mysql.createConnection(loginDBConfig));
    }


    async insert(insertData: Partial<LoginData> & {[key: string]: string | number}): Promise<boolean> {
        if (insertData.password === undefined) {
            throw new Error("LoginDBClient.insert must receive 'password'.")
        }

        const keys = Object.keys(insertData).filter(isAllowedString);
        const values = keys.map((value) => insertData[value]);
        const pwIndex = keys.indexOf("password");
        const keyPart = keys.join(", ");
        const valuePart = Array(values.length).fill("?")
            .map((_, index) => index === pwIndex ? "SHA2(?, 256)" : "?")
            .join(", ");

        const sql = `INSERT INTO users(${keyPart}) VALUES (${valuePart})`;

        try {
            const [result]: [OkPacket, FieldPacket[]] = await this.connection.query(sql, values);
            return result.affectedRows !== 0;
        } catch {
            return false;
        }
    }


    async update(beforeData: Partial<LoginData>, afterData: Partial<LoginData>): Promise<boolean> {
        const beforeDataKeys = Object.keys(beforeData).filter(isAllowedString);
        const afterDataKeys = Object.keys(afterData).filter(isAllowedString);
        const beforeDataValues = Object.values(beforeData);
        const afterDataValues = Object.values(afterData);
        // const values = beforeDataValues.concat(afterDataValues);
        const values = afterDataValues.concat(beforeDataValues);


        const beforePwIndex = beforeDataKeys.indexOf("password");
        const afterPwIndex = afterDataKeys.indexOf("password");
        const sql = `UPDATE users SET ${keys2query(afterDataKeys, afterPwIndex, ", ")}
            WHERE ${keys2query(beforeDataKeys, beforePwIndex)}`;

        try {
            const [result]: [OkPacket, FieldPacket[]] = await this.connection.query(sql, values);
            return result.affectedRows !== 0;
        } catch(e) {
            throw e;
            return false;
        }
    }


    async delete(deleteData: Partial<LoginData>): Promise<boolean> {
        const keys = Object.keys(deleteData).filter(isAllowedString);
        const values = Object.values(deleteData);
        const pwIndex = keys.indexOf("password");
        const sql = `DELETE FROM users WHERE ${keys2query(keys, pwIndex)}`;

        try {
            const [result]: [OkPacket, FieldPacket[]] = await this.connection.query(sql, values);
            return result.affectedRows !== 0;
        } catch {
            return false;
        }
    }


    async select(selectData: Partial<LoginData>): Promise<LoginData[]> {
        const keys = Object.keys(selectData).filter(isAllowedString);
        const values = Object.values(selectData);
        const pwIndex = keys.indexOf("password");
        const sql = `SELECT * FROM users WHERE ${keys2query(keys, pwIndex)}`;

        try {
            const [result]: [LoginDBResultData[], FieldPacket[]] = await this.connection.query(sql, values);
            return result.map(removeBlockedFields);
        } catch {
            return [];
        }
    }


    async close(): Promise<void> {
        await this.connection.end();
    }
}