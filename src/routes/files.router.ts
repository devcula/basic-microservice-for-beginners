import express, { Response } from 'express';
import { authorizeRequest } from '../middlewares/auth.middleware';
import { authorizeTutor } from '../middlewares/tutor.middleware';
import { CustomRequest } from '../interfaces/auth.interface';
import { ValidationError } from '../errors/validation.error';
import { handleFileUpload } from '../middlewares/files.middleware';
import { FILE_TYPES } from '../enums/files.enum';
import _ from 'lodash';
import { UploadedFile } from '../interfaces/files.interface';
import { deleteFile } from '../../fileStorage';
import * as FileService from '../services/file.service';

const router = express.Router();
// Attach custom middleware to verify JWT token as these are protected routes
router.use(authorizeRequest);

router.get("/", (req: CustomRequest, res: Response) => {
    res.send("FILES!");
});

router.post("/upload", authorizeTutor, handleFileUpload, async (req: CustomRequest, res: Response) => {
    const uploadedFile: UploadedFile = req.file as UploadedFile;

    try {
        const tutor = req.userDetails;
        const classroomId = req.query.classroomId;
        const { fileType, description } = req.body;

        if (!Object.values(FILE_TYPES).includes(fileType)) {
            throw new ValidationError('Incorrect fileType passed');
        }

        if (!classroomId || typeof classroomId !== "string" || !description) {
            // This check is already added in the handleFileUploads middleware. But still..
            throw new ValidationError('ClassroomId and file description is mandatory');
        }

        if (!uploadedFile && fileType !== FILE_TYPES.URL) {
            throw new ValidationError("Either attach a file or use fileType as URL for url type files.");
        }

        const savedFileDetails = await FileService.saveUploadedFileToDB(tutor.userId, parseInt(classroomId), req.body, uploadedFile);

        res.status(200).json({ message: 'Files uploaded successfully', fileDetails: savedFileDetails });
    }
    catch (err) {
        // If file already saved in the file system, delete them in case of any error.
        if (uploadedFile) {
            deleteFile(uploadedFile.path);
        }
        const statusCode = err instanceof ValidationError ? 400 : 500;
        res.status(statusCode).json({ error: err?.message });
    }
});

export default router;