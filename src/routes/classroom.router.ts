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

        const classroom = await ClassroomService.createClassroom(className, tutor.userId);
        res.status(200).json({ classroom: classroom });
    }
    catch (err) {
        const statusCode = err instanceof ValidationError ? 400 : 500;
        res.status(statusCode).json({ error: err?.message });
    }
});

router.post("/addStudents", authorizeTutor, async (req: CustomRequest, res: Response) => {
    /**
     * This route can add one or more students based on requirement.
     */
    try {
        const tutor = req.userDetails;
        const { classroomId, students } = req.body;

        if (!classroomId) {
            throw new ValidationError('Classroom Id is mandatory to add students in it');
        }
        if (!Array.isArray(students)) {
            // Expecting list of student usernames here
            throw new ValidationError('List of students is mandatory');
        }

        await ClassroomService.addStudents(tutor.userId, classroomId, students);
        res.status(200).json({ message: "Success" });
    }
    catch (err) {
        const statusCode = err instanceof ValidationError ? 400 : 500;
        res.status(statusCode).json({ error: err?.message });
    }
});

router.delete("/removeStudent", authorizeTutor, async (req: CustomRequest, res: Response) => {
    try {
        const tutor = req.userDetails;
        const { classroomId, student } = req.body;

        if (!classroomId) {
            throw new ValidationError('Classroom Id is mandatory to remove students');
        }
        if (!student) {
            // Expecting student username
            throw new ValidationError('student(username) is mandatory');
        }

        await ClassroomService.removeStudent(tutor.userId, classroomId, student);
        res.status(200).json({ message: "Success" });
    }
    catch (err) {
        const statusCode = err instanceof ValidationError ? 400 : 500;
        res.status(statusCode).json({ error: err?.message });
    }
});

router.get("/feed", async (req: CustomRequest, res: Response) => {
    const userDetails = req.userDetails;
    try {
        const classesFeed = await ClassroomService.getFeed(userDetails.userRole, userDetails.userId);
        res.status(200).json({ feed: classesFeed });
    }
    catch (err) {
        console.log("Error while fetching classroom feed", err);
        res.status(500).json({ error: err?.message });
    }
});

export default router;