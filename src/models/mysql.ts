import { DataTypes, Model, Sequelize } from 'sequelize';
import config from '../../config';
import { ClassroomAttributes, ClassroomCreationAttributes, ClassroomStudentAttributes, FileAttributes, FileCreationAttributes, RoleAttributes, UserAttributes, UserCreationAttributes } from '../interfaces/models.interface';
import { ROLES } from '../enums/users.enum';

// Sequelize connection configuration
export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: config.MYSQL.HOST,
    username: config.MYSQL.USER,
    password: config.MYSQL.PASSWORD,
    database: config.MYSQL.DATABASE,
    logging: console.log,
});

export class Role extends Model<RoleAttributes, RoleAttributes> implements RoleAttributes {
    public id!: number;
    public name!: ROLES;
}

Role.init({
    name: {
        type: DataTypes.ENUM('tutor', 'student'),
        allowNull: false,
        primaryKey: true
    },
}, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: false
});

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;
    public role!: ROLES;
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
    role: {
        type: DataTypes.ENUM(ROLES.TUTOR, ROLES.STUDENT),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
});

User.belongsTo(Role, { foreignKey: 'role' });
Role.hasMany(User, { foreignKey: 'role' });

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

export class ClassroomStudent extends Model<ClassroomStudentAttributes> implements ClassroomStudentAttributes {
    public studentId!: number;
    public classroomId!: number;
}

ClassroomStudent.init({
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    classroomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
}, {
    sequelize,
    modelName: 'ClassroomStudent',
    tableName: 'classroom_students',
});

// Define associations in Classroom and User models
Classroom.belongsToMany(User, { through: 'ClassroomStudent', foreignKey: 'classroomId' });
User.belongsToMany(Classroom, { through: 'ClassroomStudent', foreignKey: 'studentId' });

export const initDatabase = async () => {
    // Verify connection with the database
    await sequelize.authenticate();

    // SYNC Models with database tables
    await sequelize.sync({ alter: true });

    // Insert initial values required for Application to run. In this case roles.
    // In prod code this wouldn't be there as those seed data are inserted manually during initial table creation using deployment/setup scripts.
    for (const [key, value] of Object.entries(ROLES)) {
        try {
            await Role.create({ name: value });
        }
        catch (err) { }
    }
}