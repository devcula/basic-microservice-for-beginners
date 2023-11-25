import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouter from './routes/auth.router';
import ClassRoomRouter from './routes/classroom.router';
import { config } from 'dotenv';
import { initDatabase, sequelize as sequelizeInstance } from './models/mysql';

config();   // Load config like secrets etc in process.env to be accessible everywhere

const app = express();
const port = process.env.PORT || 3000;

// Define all the routes here and attach the routers.
const allRoutes = [
    {
        path: "/auth",
        router: AuthRouter
    },
    {
        path: "/classroom",
        router: ClassRoomRouter
    }
];

async function startServer() {
    // Initialise database
    await initDatabase();

    // Add middlewares
    app.use(bodyParser.json());
    app.use(cors());

    // Add a default route for health-checks etc..
    app.get('/', (req, res) => {
        res.send('Working!');
    });

    // Attaching all the defined routes to the server
    allRoutes.forEach(route => {
        app.use(route.path, route.router);
    });

    const server = app.listen(port, () => {
        return console.log(`Express is listening at http://localhost:${port}`);
    });

    // Some global error handles to make sure some unhandled error in a request doesn't kill the entire server
    process.on('uncaughtException', (error) => {
        console.error('[GLOBAL] uncaught exception', error);
    });

    process.on('unhandledRejection', (error) => {
        console.error('[GLOBAL] unhandled rejection', error);
    });

    // Do cleanup operations on server shutdown.
    process.on('SIGINT', async () => {
        try {
            // Close Database connection
            await sequelizeInstance.close();
            console.log('Sequelize connection closed.');

            // Close the Express server
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        } catch (error) {
            console.error('Error closing Sequelize connection:', error);
            process.exit(1);
        }
    });
}

startServer();