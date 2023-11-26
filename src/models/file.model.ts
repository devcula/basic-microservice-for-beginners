import { FileDetails } from "../interfaces/files.interface";
import { FileCreationAttributes } from "../interfaces/models.interface";
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
    // Update filename in the database
    await File.destroy({ where: { id: fileId } });
}