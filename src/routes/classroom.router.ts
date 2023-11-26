import express, { Response } from 'express';
import { authorizeRequest } from '../middlewares/auth.middleware';
import { CustomRequest } from '../interfaces/auth.interface';
import { authorizeTutor } from '../middlewares/tutor.middleware';
import { ValidationError } from '../errors/validation.error';
import * as ClassroomService from '../services/classroom.service';

const router = express.Router();
// Attach custom middleware to verify JWT token as these are protected routes
router.use(authorizeRequest);

router.get("/", (req: CustomRequest, res: Response) => {
    res.send("CLASSROOM!");
});

router.post("/create", authorizeTutor, async (req: CustomRequest, res: Response) => {
    try {
        const tutor = req.userDetails;
        const { className } = req.body;

        if (!className) {
            throw new ValidationError('Class name is mandatory to create classroom');
        }
        if (!tutor?.userId) {
            // This should never be the case if flow is reaching this handler. But, it never hurts to put an extra check.
            throw new ValidationError('Kindly login and try again');
        }

        const classroom = await ClassroomService.createClassroom(className, tutor.userId);
        res.status(200).json({ classroom: classroom });
    }
    catch (err) {
        const statusCode = err instanceof ValidationError ? 400 : 500;
        res.status(statusCode).json({ error: err?.message });
    }
});

router.post("/addStudents", authorizeTutor, async (req: CustomRequest, res: Response) => {
    try {
        const tutor = req.userDetails;
        const { classroomId, students } = req.body;

        if (!classroomId) {
            throw new ValidationError('Classroom Id is mandatory to add students in it');
        }
        if (!Array.isArray(students)) {
            // Expecting list of student usernames here
            throw new Error('List of students is mandatory');
        }
        if (!tutor?.userId) {
            throw new ValidationError('Kindly login and try again');
        }

        await ClassroomService.addStudents(tutor.userId, classroomId, students);
        res.status(200).json({ message: "Success" });
    }
    catch (err) {
        const statusCode = err instanceof ValidationError ? 400 : 500;
        res.status(statusCode).json({ error: err?.message });
    }
});

export default router;