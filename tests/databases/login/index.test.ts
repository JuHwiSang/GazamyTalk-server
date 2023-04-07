import dotenv from "dotenv";
dotenv.config();

import LoginDBClient from "@databases/login";

let client: LoginDBClient;
let userid: number;
const selectedPassword = "ACCESS DENIED";


test("initialize client", async () => {
    client = await LoginDBClient.create();
    await client.delete( { username: '__dev_test_user' })
})

test("SELECT before insert user", async () => {
    const requiredResult: object[] = [];
    expect(await client.select({ userid: userid })).toStrictEqual(requiredResult);
    expect(await client.select({ username: '__dev_test_user' })).toStrictEqual(requiredResult);
    expect(await client.select({ username: '__dev_test_user', password: '__dev_test_pass1' })).toStrictEqual(requiredResult);
})

test("INSERT user", async () => {
    let result = await client.insert({ username: '__dev_test_user', password: '__dev_test_pass1' });
    expect(result).toBe(true);
})

test("get userid", async () => {
    userid = (await client.select({ username: '__dev_test_user' }))[0].userid;
})

test("SELECT after insert user", async () => {
    const requiredResult = [{
        userid: userid,
        username: '__dev_test_user',
        password: selectedPassword
    }];
    expect(await client.select({ userid: userid })).toStrictEqual(requiredResult);
    expect(await client.select({ username: '__dev_test_user' })).toStrictEqual(requiredResult);
    expect(await client.select({ username: '__dev_test_user', password: '__dev_test_pass1' })).toStrictEqual(requiredResult);
})

test("UPDATE user", async () => {
    let result = await client.update({ userid: userid }, { password: '__dev_test_pass2' });
    expect(result).toBe(true);
})

test("SELECT after update user", async () => {
    expect(await client.select({ username: '__dev_test_user', password: '__dev_test_pass2' }))
        .toStrictEqual([{ userid: userid, username: '__dev_test_user', password: selectedPassword }]);
})

test("DELETE user", async () => {
    let result = await client.delete({ userid: userid });
    expect(result).toBe(true);
})

test("SELECT after delete user", async () => {
    const requiredResult: object[] = [];
    expect(await client.select({ userid: userid })).toStrictEqual(requiredResult);
    expect(await client.select({ username: '__dev_test_user' })).toStrictEqual(requiredResult);
    expect(await client.select({ username: '__dev_test_user', password: '__dev_test_pass1' })).toStrictEqual(requiredResult);
    expect(await client.select({ username: '__dev_test_user', password: '__dev_test_pass2' })).toStrictEqual(requiredResult);
})