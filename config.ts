const config = {
    JWT_PASSPHRASE: process.env.JWT_PASSPHRASE || 'test-secret',
    MYSQL: {
        HOST: process.env.MYSQL_HOST || "localhost",
        USER: process.env.MYSQL_USER || "root",
        PASSWORD: process.env.MYSQL_PASSWORD || "root",
        DATABASE: "TEST_DEV_DB"
    }
};

export default config;