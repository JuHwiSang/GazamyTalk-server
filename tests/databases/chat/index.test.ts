import dotenv from "dotenv";
dotenv.config();

import ChatDBClient from "@databases/chat";

describe("test chatDBClient", () => {

    let client: ChatDBClient;

    beforeAll(async () => {
        client = await ChatDBClient.create();
        await client.delete({roomid: 100});
    })

    test("select before insert", async () => {
        let result = await client.select({roomid: 1});
        expect(result.length).toBe(0);
    })

    test("insert chat", async () => {
        let result = await client.insert({
            chatid: 100,
            roomid: 100,
            userid: 100,
            content: "__dev_test_content",
            type: "__dev_test_type",
            time: 100.103013
        });
        expect(result).toBe(1);
    });

    test("select after insert", async () => {
        let result = await client.select({roomid: 100});
        expect(result.length).toBe(1);
        result = await client.select({roomid: 10});
        expect(result.length).toBe(0);
    })
    
    test("update chat", async () => {
        let result = await client.update({
            chatid: 100,
            roomid: 100
        }, {
            content: "__dev_test_content2"
        });
        expect(result).toBe(1);
    })

    test("select after update", async () => {
        let result = await client.select({roomid: 100, content: "__dev_test_content2"});
        expect(result.length).toBe(1);
        expect(result[0].content).toBe("__dev_test_content2");
    })
    
    test("delete chat", async () => {
        let result = await client.delete({roomid: 100, chatid: 100});
        expect(result).toBe(1);
    })
    
    test("select after delete", async () => {
        let result = await client.select({roomid: 100});
        expect(result.length).toBe(0);
    })
})