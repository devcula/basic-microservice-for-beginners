/**
 * This file contains all the interfaces with same structure as DB tables. This will help us in defining sequelize models with proper types.
 */

import { Model, DataTypes, Optional } from 'sequelize';

export interface RoleAttributes {
    id: number;
    name: 'tutor' | 'student';
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> { }

export interface UserAttributes {
    id: number;
    username: string;
    password: string;
    roleId: number;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export interface ClassroomAttributes {
    id: number;
    tutorId: number;
    className: string;
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
}

export interface FileCreationAttributes extends Optional<FileAttributes, 'id'> { }