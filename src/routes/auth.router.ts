import express from 'express';
import { ValidationError } from '../errors/validation.error';
import * as AuthController from '../controllers/auth.controller';

const router = express.Router();

router.get("/", (req, res) => {
    res.send('AUTH!');
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ValidationError("Username and password are mandatory");
        }

        const response = await AuthController.login(username, password);
        res.status(200).json({ data: response });
    }
    catch (err) {
        const statusCode = err instanceof ValidationError ? 400 : 500;
        res.status(statusCode).json({ error: err?.message });
    }
});

export default router;