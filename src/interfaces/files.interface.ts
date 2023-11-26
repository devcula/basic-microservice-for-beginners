/**
 * Sample uploaded file values
  {
    fieldname: 'files',
    originalname: 'earth.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'uploads/',
    filename: 'files-1700997550225.jpg',
    path: 'uploads/files-1700997550225.jpg',
    size: 840521
  }
 */

import { FILE_TYPES } from "../enums/files.enum";

export interface UploadedFile {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  destination: string,
  filename: string,
  path: string,
  size: number
}

export interface FileDetails {
  description: string;
  fileType: FILE_TYPES;
  fileLocation: string;
  filename: string;
}

export interface FileFeed {
  fileId: number;
  filename: string;
  fileType: FILE_TYPES;
  fileDescription: string;
  data?: any;
  url?: string;
}