import { Sequelize } from 'sequelize';
import config from '../../config';

// Sequelize connection configuration
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: config.MYSQL.HOST,
    username: config.MYSQL.USER,
    password: config.MYSQL.PASSWORD,
    database: 'TEST_DEV_DB',
});

export default sequelize;