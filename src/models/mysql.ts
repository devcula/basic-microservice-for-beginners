import { DataTypes, Sequelize } from 'sequelize';
import config from '../../config';

// Sequelize connection configuration
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: config.MYSQL.HOST,
    username: config.MYSQL.USER,
    password: config.MYSQL.PASSWORD,
    database: config.MYSQL.DATABASE,
    logging: (...msg) => console.log(msg),
});

const Role = sequelize.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.ENUM('tutor', 'student'),
        allowNull: false,
    },
}, { tableName: "roles" });

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, { tableName: "users" });

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

const Classroom = sequelize.define('Classroom', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tutorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    className: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { tableName: "classrooms" });

Classroom.belongsTo(User, { foreignKey: 'tutorId' });
User.hasMany(Classroom, { foreignKey: 'tutorId' });


const File = sequelize.define('File', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    classroomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    filename: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    uploadedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    fileType: {
        type: DataTypes.ENUM('audio', 'video', 'image', 'url'),
        allowNull: false,
    },
}, { tableName: "files" });

File.belongsTo(Classroom, { foreignKey: 'classroomId' });
File.belongsTo(User, { foreignKey: 'uploadedBy' });
Classroom.hasMany(File, { foreignKey: 'classroomId' });

// sequelize.sync({ force: true });

export default sequelize;