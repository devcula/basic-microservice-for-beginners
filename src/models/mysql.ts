import { DataTypes, Model, Sequelize } from 'sequelize';
import config from '../../config';
import { ClassroomAttributes, ClassroomCreationAttributes, FileAttributes, FileCreationAttributes, RoleAttributes, RoleCreationAttributes, UserAttributes, UserCreationAttributes } from '../interfaces/models.interface';

// Sequelize connection configuration
export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: config.MYSQL.HOST,
    username: config.MYSQL.USER,
    password: config.MYSQL.PASSWORD,
    database: config.MYSQL.DATABASE,
    logging: (...msg) => console.log(msg),
});

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: number;
    public name!: 'tutor' | 'student';
}

Role.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.ENUM('tutor', 'student'),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
});

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;
    public roleId!: number;
}

User.init({
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
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
});

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

export class Classroom extends Model<ClassroomAttributes, ClassroomCreationAttributes> implements ClassroomAttributes {
    public id!: number;
    public tutorId!: number;
    public className!: string;
}

Classroom.init({
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
}, {
    sequelize,
    modelName: 'Classroom',
    tableName: 'classrooms',
});

Classroom.belongsTo(User, { foreignKey: 'tutorId' });
User.hasMany(Classroom, { foreignKey: 'tutorId' });

export class File extends Model<FileAttributes, FileCreationAttributes> implements FileAttributes {
    public id!: number;
    public classroomId!: number;
    public filename!: string;
    public description!: string;
    public uploadedAt!: Date;
    public uploadedBy!: number;
    public deleted!: boolean;
    public fileType!: 'audio' | 'video' | 'image' | 'url';
}

File.init({
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
}, {
    sequelize,
    modelName: 'File',
    tableName: 'files',
});

File.belongsTo(Classroom, { foreignKey: 'classroomId' });
File.belongsTo(User, { foreignKey: 'uploadedBy' });
Classroom.hasMany(File, { foreignKey: 'classroomId' });