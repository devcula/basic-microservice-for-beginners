# A basic Microservice reference for beginners

### A basic stateless microservice implemented using below libraries/frameworks
    - Node.js
    - Typescript
    - Express
    - JWT authentication
    - MySQL
    - Sequelize
    - Multer for file storage

## Steps to run the project
    1. Make sure that SQL server is running on your localhost and a test database is created.
    2. Update the SQL connection creds and database name in config.ts file
    3. Update the file storage path in config.ts. This is basically where the uploaded files will be stored on your system.
    4. Run npm start. If any error comes up, make sure typescript is installed globally on your system (npm install -g typescript).
    5. If still not able to start, you can try replacing "tsc" with "npx tsc" in build script in package.json.
    6. If still not working, well reach out to me with the error.

## IMPORTANT
    -> To register as a tutor, please prefix the username with the keyword "tutor" like "tutor1" or "tutor-test".
    -> Any other username which DOESN'T START WITH "tutor" will be registered/authorized as a student.


## NOTES:
    - You don't need to run the SQL scripts to create tables. Sequelize will automatically take care of that when the server is start. The defined models are synced with the database.
    - You also don't need to add default roles i.e. tutor/student. I have added some server startup code to automatically insert the roles defined in the enum.
    - SQL scripts, ER diagram and Postman Collection are present in project_metadata folder
    - Use "npm run dev" to run the server if you want to try it in development mode.

# Cheers!

