/**
 * This file contains all the interfaces with same structure as DB tables. This will help us in defining sequelize models with proper types.
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { ROLES } from '../enums/users.enum';

export interface RoleAttributes {
    name: ROLES;
}

export interface UserAttributes {
    id: number;
    username: string;
    password: string;
    role: ROLES;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export interface ClassroomAttributes {
    id: number;
    tutorId: number;
    className: string;
    // Not required fields added below to be used in case of JOIN queries
    User?: Partial<UserAttributes>;
}

export interface ClassroomCreationAttributes extends Optional<ClassroomAttributes, 'id'> { }

export interface FileAttributes {
    id: number;
    classroomId: number;
    filename: string;
    description: string;
    uploadedAt: Date;
    uploadedBy: number;
    deleted: boolean;
    fileType: 'audio' | 'video' | 'image' | 'url';
    // Not required fields added below to be used in case of JOIN queries
    Classroom?: Partial<ClassroomAttributes>;
    User?: Partial<UserAttributes>;
}

export interface FileCreationAttributes extends Optional<FileAttributes, 'id'> { }