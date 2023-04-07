function assertUndefinedValue(obj: {[key: string] : any}, name: string) : void {
    const keys = Object.keys(obj);
    const values = keys.map((value) => obj[value]);
    values.forEach((value, index) => {
        if (value === undefined) {
            throw new Error(`Configuration Error: ${name}.${keys[index]} is undefined`)
        }
    });
}

export const loginDBConfig = {
    host: process.env.LOGIN_DB_HOST!,
    port: Number.parseInt(process.env.LOGIN_DB_PORT || "0"),
    user: process.env.LOGIN_DB_USER!,
    password: process.env.LOGIN_DB_PASSWORD!,
    database: process.env.LOGIN_DB_DATABASE!
};
assertUndefinedValue(loginDBConfig, 'loginDBConfig');

export const mainDBConfig = {
    uri: process.env.MAIN_DB_URI!
}
assertUndefinedValue(mainDBConfig, 'mainDBConfig');