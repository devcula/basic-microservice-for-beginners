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