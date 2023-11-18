import express, { Response } from 'express';
import { authorizeRequest } from '../middlewares/auth.middleware';
import { CustomRequest } from '../interfaces/auth.interface';

const router = express.Router();
// Attach custom middleware to verify JWT token as these are protected routes
router.use(authorizeRequest);

router.get("/", (req: CustomRequest, res: Response) => {
    console.log(req.username);
    console.log(req.userType);
    res.send("CLASSROOM!");
});

export default router;