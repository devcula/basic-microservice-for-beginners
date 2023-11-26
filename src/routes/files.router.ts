import express, { Response } from 'express';
import { authorizeRequest } from '../middlewares/auth.middleware';
import { authorizeTutor } from '../middlewares/tutor.middleware';
import { CustomRequest } from '../interfaces/auth.interface';
import { ValidationError } from '../errors/validation.error';
import { handleFileUploads } from '../middlewares/files.middleware';

const router = express.Router();
// Attach custom middleware to verify JWT token as these are protected routes
router.use(authorizeRequest);

router.get("/", (req: CustomRequest, res: Response) => {
    res.send("FILES!");
});

router.post("/upload", authorizeTutor, handleFileUploads, async (req: CustomRequest, res: Response) => {
    try {
        const tutor = req.userDetails;
        const { classroomId } = req.body;

        if (!classroomId) {
            // This check is already added in the handleFileUploads middleware. But still..
            throw new ValidationError('Classroom id is mandatory');
        }

        console.log("Files uploaded", req.files);
        console.log("Class room id", classroomId);
        console.log("Remaining request body", req.body);

        res.status(200).json({ message: 'Files uploaded successfully' });
    }
    catch (err) {
        // If files already saved in the file system, get the path and delete them here.
        const statusCode = err instanceof ValidationError ? 400 : 500;
        res.status(statusCode).json({ error: err?.message });
    }
});

export default router;