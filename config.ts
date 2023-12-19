const config = {
    JWT_PASSPHRASE: process.env.JWT_PASSPHRASE || 'test-secret',
    MYSQL: {
        HOST: process.env.MYSQL_HOST || "host.docker.internal",
        USER: process.env.MYSQL_USER || "root",
        PASSWORD: process.env.MYSQL_PASSWORD || "root",
        DATABASE: "TEST_DEV_DB"
    },
    FILES_STORAGE_LOCATION: process.env.FILE_PATH || '/tmp/fileUploads'
};

export default config;