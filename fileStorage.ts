/**
 * Reference taken from npm docs
 * https://www.npmjs.com/package/multer
 */

/**
 * For production and highly scalable environments, the best approach would be to use AWS S3/Google Cloud storage/Azure BLOB storage
 * However, those are easy to integrate and since this is a test project, I didn't wanna shell any money :P
 * So, we will have our very own file storage system. Win-Win!
 */

/**
 * IMPORTANT: Have all the file storage utility functions defined in this file only to keep the relative path of the files same.
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Check if the upload directory exists
// If not, create one
// NOTE: A new directory uploads/ will be created where all the uploaded files will be written
const currentPath = __dirname;
const uploadDirName = 'uploads';

const uploadsDir = path.join(currentPath, uploadDirName);

if (!fs.existsSync(uploadsDir)) {
    // If not, create the directory
    fs.mkdirSync(uploadsDir);
}

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Function to get the destination folder
        cb(null, `${uploadDirName}/`);
    },
    filename: function (req, file, cb) {
        // This function will be called to get the filename for the file. Return unique file names from here.
        cb(null, 'file-' + Date.now() + path.extname(file.originalname));
    }
});

export const deleteFile = (relativePath: string) => {
    // Delete files from filestorage with relative path from this file
    try {
        fs.unlinkSync(path.join(currentPath, relativePath))
    }
    catch (err) { }
}