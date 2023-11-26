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