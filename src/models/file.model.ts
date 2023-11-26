import { FindOptions, Op } from "sequelize";
import { FILE_TYPES } from "../enums/files.enum";
import { FileDetails } from "../interfaces/files.interface";
import { FileAttributes, FileCreationAttributes } from "../interfaces/models.interface";
import { File } from "./mysql";

export const saveFileDetailsToDB = async (tutorId: number, classroomId: number, file: FileDetails) => {
    const fileData: FileCreationAttributes = {
        classroomId,
        filename: file.filename,
        description: file.description,
        uploadedAt: new Date(),
        uploadedBy: tutorId,
        deleted: false,
        fileType: file.fileType,
        fileLocation: file.fileLocation
    }

    const createdFile = await File.create(fileData);
    return createdFile;
}

export const getFileDetails = async (fileId: number) => {
    const file = await File.findByPk(fileId);
    return file;
}

export const renameFile = async (fileId: number, newFilename: string) => {
    // Update filename in the database
    await File.update({ filename: newFilename }, { where: { id: fileId } });
}

export const deleteFile = async (fileId: number) => {
    // Soft deleting the file
    await File.update({ deleted: true }, { where: { id: fileId } });
}

export const getFilesByClassroom = async (classroomId: number, searchTerm?: string, fileType?: FILE_TYPES) => {
    const filterQuery: any = {
        where: {
            classroomId,
            deleted: false
        }
    };

    if (searchTerm) {
        filterQuery.where.filename = {
            [Op.substring]: searchTerm
        }
    }

    if (fileType) {
        filterQuery.where.fileType = fileType
    }

    const filesMetadata = await File.findAll(filterQuery);
    return filesMetadata;
}