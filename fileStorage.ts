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
import path from 'path';
import fs from 'fs';

// Check if the upload directory exists
// If not, create one
// NOTE: A new directory uploads/ will be created where all the uploaded files will be written

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    // If not, create the directory
    fs.mkdirSync(uploadsDir);
}

export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Function to get the destination folder
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // This function will be called to get the filename for the file. Return unique file names from here.
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});