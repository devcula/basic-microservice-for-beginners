import { ValidationError } from "../errors/validation.error";
import { FILE_TYPES } from "../enums/files.enum";
import { KeyValue } from "../interfaces/common.interface";
import { FileDetails, FileFeed, UploadedFile } from "../interfaces/files.interface";
import * as FileModel from "../models/file.model";
import * as ClassroomModel from "../models/classroom.model";
import { deleteFile as deleteFileFromStorage, getFileData } from "../../fileStorage";
import { ROLES } from "../enums/users.enum";
import { isUserPartOfClassroom } from "./classroom.service";
import _ from "lodash";
import { File } from "../models/mysql";

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

const getFileFeedData = (file: File) => {
    const fileDetails = file.toJSON();
    let feedData: FileFeed = {
        fileId: fileDetails.id,
        filename: fileDetails.filename,
        fileType: fileDetails.fileType,
        fileDescription: fileDetails.description,
    };
    if (fileDetails.fileType === FILE_TYPES.URL) {
        feedData.url = fileDetails.fileLocation;
    }
    else {
        feedData.data = getFileData(fileDetails.fileLocation);
    }

    return feedData;
}

export const getFeed = async (userRole: ROLES, userId: number, classroomId: number, searchTerm?: string, fileType?: FILE_TYPES) => {
    let filesFeed: FileFeed[] = []

    const classroomDetails = await ClassroomModel.getClassroomDetails(classroomId);
    if (!classroomDetails) {
        throw new Error("Classroom not found");
    }

    // Check if user is part of the classroom or not
    const isClassroomAccessibleByUser = await isUserPartOfClassroom(userId, classroomId);

    if (userRole === ROLES.STUDENT) {
        // Student can only access the feed if he is part of the classroom
        if (!isClassroomAccessibleByUser) {
            throw new Error("Logged in student is not part of the classroom");
        }
    }
    else {
        // A tutor can only access the feed if either he created the classroom or he is a part of it
        if (!isClassroomAccessibleByUser && classroomDetails.toJSON().tutorId !== userId) {
            throw new Error("Logged in tutor doesn't have access to the classroom. Only tutor who has created the classroom or are a part of it can access the feed.");
        }
    }

    // If flow is reaching here, means files feed is accessible by the user for that class. Query and return.
    const filesMetadata = await FileModel.getFilesByClassroom(classroomId, searchTerm, fileType);
    _.forEach(filesMetadata, (file) => {
        filesFeed.push(getFileFeedData(file));
    });

    return filesFeed;
}