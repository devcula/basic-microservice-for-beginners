/**
 * Reference taken from npm docs
 * https://www.npmjs.com/package/multer
 */

/**
 * For production and highly scalable environments, the best approach would be to use AWS S3/Google Cloud storage/Azure BLOB storage
 * However, those are easy to integrate and since this is a test project, I didn't wanna shell any money :P
 * So, we will have our very own file storage system. Win-Win!
 */

import multer from 'multer';
import { storage } from '../../fileStorage';
import { CustomRequest } from '../interfaces/auth.interface';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'audio/mp3', 'video/mp4']; // Adjust as needed

const fileFilter = function (req: CustomRequest, file: any, cb: any) {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

const fileUpload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000, //10 MB max file size
    },
    fileFilter
});

export const handleFileUploads = fileUpload.array('files', 5);  // Upload files passed in "files" key in body. Max 5 files.