import dotenv from "dotenv";
dotenv.config();

import MainDBClient from "@databases/main";

let client: MainDBClient;

beforeAll(async () => {
    client = await MainDBClient.create();
});

describe("test UserInfo", () => {

    beforeAll(async () => {
        client.deleteUser({ username: "__dev_test_username" })
    })

    test("select before insert", async () => {
        let result = await client.selectUser({
            userid: 1
        })
        expect(result.length).toBe(0);
    })

    test("insert userInfo", async () => {
        let result = await client.insertUser({
            userid: 1,
            username: "__dev_test_username",
            description: "__dev_test_description",
            nickname: "__dev_test_nickname",
            rooms: []
        });
        expect(result).toBeGreaterThan(0);
    })

    test("select after insert", async () => {
        let result = await client.selectUser({
            userid: 1
        })
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].description).toBe("__dev_test_description");

        result = await client.selectUser({
            username: "__dev_test_no_exist_username"
        });
        expect(result.length).toBe(0);
    })

    test("update userInfo", async () => {
        let result = await client.updateUser({
            userid: 1
        }, {
            nickname: "__dev_test_nickname_2"
        });
        expect(result).toBeGreaterThan(0);
    })

    test("select after update", async () => {
        let result = await client.selectUser({
            userid: 1,
            nickname: "__dev_test_nickname_2"
        })
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].nickname).toBe("__dev_test_nickname_2");
        expect(result[0].username).toBe("__dev_test_username");
    })

    test("delete userInfo", async () => {
        let result = await client.deleteUser({
            userid: 1
        })
        expect(result).toBeGreaterThan(0);
    })

    test("select after delete", async () => {
        let result = await client.selectUser({
            userid: 1
        })
        expect(result.length).toBe(0);
    })

})


describe("test RoomInfo", () => {

    beforeAll(async () => {
        client.deleteRoom({ roomname: "__dev_test_roomname" })
    })

    test("select before insert", async () => {
        let result = await client.selectRoom({
            roomid: 1
        })
        expect(result.length).toBe(0);
    })

    test("insert roomInfo", async () => {
        let result = await client.insertRoom({
            roomid: 1,
            roomname: "__dev_test_roomname",
            description: "__dev_test_description",
            users: []
        });
        expect(result).toBeGreaterThan(0);
    })

    test("select after insert", async () => {
        let result = await client.selectRoom({
            roomid: 1
        })
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].description).toBe("__dev_test_description");

        result = await client.selectRoom({
            roomname: "__dev_test_no_exist_username"
        });
        expect(result.length).toBe(0);
    })

    test("update roomInfo", async () => {
        let result = await client.updateRoom({
            roomid: 1
        }, {
            description: "__dev_test_description_2"
        });
        expect(result).toBeGreaterThan(0);
    })

    test("select after update", async () => {
        let result = await client.selectRoom({
            roomid: 1,
            description: "__dev_test_description_2"
        })
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].description).toBe("__dev_test_description_2");
        expect(result[0].roomname).toBe("__dev_test_roomname");
    })

    test("delete roomInfo", async () => {
        let result = await client.deleteRoom({
            roomid: 1
        })
        expect(result).toBeGreaterThan(0);
    })

    test("select after delete", async () => {
        let result = await client.selectRoom({
            roomid: 1
        })
        expect(result.length).toBe(0);
    })

    test("close client", async () => {
        await client.close();
    })

    test("insert after close", async () => {
        let result = await client.insertRoom({
            roomid: 1,
            roomname: "__dev_test_roomname",
            description: "__dev_test_description",
            users: []
        });
        expect(result).toBe(0);
    })

})