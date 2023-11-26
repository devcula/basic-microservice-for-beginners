import { ValidationError } from "../errors/validation.error";
import { FILE_TYPES } from "../enums/files.enum";
import { KeyValue } from "../interfaces/common.interface";
import { FileDetails, UploadedFile } from "../interfaces/files.interface";
import * as FileModel from "../models/file.model";
import * as ClassroomModel from "../models/classroom.model";
import { deleteFile as deleteFileFromStorage } from "../../fileStorage";

export const saveUploadedFileToDB = async (tutorId: number, classroomId: number, body: KeyValue, uploadedFile?: UploadedFile) => {
    const fileType: FILE_TYPES = body.fileType;
    let fileDetailsToSave: FileDetails;

    if (fileType === FILE_TYPES.URL) {
        const fileUrl: string = body.fileUrl;
        if (!fileUrl) {
            throw new ValidationError("fileUrl is mandatory for fileType as URL");
        }
        if (uploadedFile) {
            throw new ValidationError("Cannot attach a file when fileType is URL");
        }
        fileDetailsToSave = {
            description: body.description,
            fileType,
            fileLocation: fileUrl,
            filename: fileUrl
        };
    }
    else {
        // A file is uploaded
        fileDetailsToSave = {
            description: body.description,
            fileType,
            fileLocation: uploadedFile.path,
            filename: uploadedFile.originalname
        };
    }

    const classroomDetails = await ClassroomModel.getClassroomDetails(classroomId);
    if (!classroomDetails) {
        throw new Error("Classroom not found");
    }
    if (classroomDetails.toJSON().tutorId !== tutorId) {
        throw new Error("This account doesn't have access to add students to this classroom");
    }

    const createdFile = await FileModel.saveFileDetailsToDB(tutorId, classroomId, fileDetailsToSave);
    return createdFile?.toJSON();
}

export const renameFile = async (tutorId: number, fileId: number, newFilename: string) => {
    const fileDetails = await FileModel.getFileDetails(fileId);

    if (!fileDetails) {
        throw new Error("File doesn't exist");
    }
    if (fileDetails.toJSON().uploadedBy !== tutorId) {
        throw new Error("Only the tutor who uploaded the file can rename it");
    }

    await FileModel.renameFile(fileId, newFilename);
}

export const deleteFile = async (tutorId: number, fileId: number) => {
    const fileDetails = await FileModel.getFileDetails(fileId);

    if (!fileDetails) {
        throw new Error("File doesn't exist");
    }
    if (fileDetails.toJSON().uploadedBy !== tutorId) {
        throw new Error("Only the tutor who uploaded the file can delete it");
    }

    deleteFileFromStorage(fileDetails.fileLocation);
    await FileModel.deleteFile(fileId);
}