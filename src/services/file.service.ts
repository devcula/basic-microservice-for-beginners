import { ValidationError } from "../errors/validation.error";
import { FILE_TYPES } from "../enums/files.enum";
import { KeyValue } from "../interfaces/common.interface";
import { UploadedFile } from "../interfaces/files.interface";
import * as FileModel from "../models/file.model";
import { File } from "../models/mysql";

export const saveUploadedFileToDB = async (tutorId: number, classroomId: number, body: KeyValue, uploadedFile?: UploadedFile) => {
    const fileType: FILE_TYPES = body.fileType;
    let createdFile: File;

    if (fileType === FILE_TYPES.URL) {
        const fileUrl: string = body.fileUrl;
        if (!fileUrl) {
            throw new ValidationError("fileUrl is mandatory for fileType as URL");
        }
        if (uploadedFile) {
            throw new ValidationError("Cannot attach a file when fileType is URL");
        }
        createdFile = await FileModel.saveFileDetailsToDB(tutorId, classroomId, {
            description: body.description,
            fileType,
            fileLocation: fileUrl,
            filename: fileUrl
        });
    }
    else {
        // A file is uploaded
        createdFile = await FileModel.saveFileDetailsToDB(tutorId, classroomId, {
            description: body.description,
            fileType,
            fileLocation: uploadedFile.path,
            filename: uploadedFile.originalname
        });
    }

    return createdFile?.toJSON();
}