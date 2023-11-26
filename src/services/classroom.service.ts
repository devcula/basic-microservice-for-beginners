import _ from 'lodash';
import { ROLES } from '../enums/users.enum';
import { ClassroomFeed } from '../interfaces/classroom.interface';
import * as ClassroomModel from '../models/classroom.model';
import * as UserModel from '../models/user.model';

export const createClassroom = async (className: string, tutorId: number) => {
    const classroom = await ClassroomModel.createClassroom(className, tutorId);
    return classroom;
}

export const addStudents = async (tutorId: number, classroomId: number, students: string[]) => {
    const classroomDetails = await ClassroomModel.getClassroomDetails(classroomId);
    if (!classroomDetails) {
        throw new Error("Classroom not found");
    }
    if (classroomDetails.toJSON().tutorId !== tutorId) {
        throw new Error("This account doesn't have access to add students to this classroom");
    }

    // Get Students details from DB instead of blindly adding. This will make sure that only correct usernames gets added.
    const studentsData = await UserModel.getMultipleUserDetails(students);

    // We can add a filter here for role === student, so that only students get added.
    // But why is it required? Why can't a tutor add another tutor to the classroom?
    // Add the students
    await ClassroomModel.addStudents(classroomId, studentsData);
}

export const removeStudent = async (tutorId: number, classroomId: number, student: string) => {
    const classroomDetails = await ClassroomModel.getClassroomDetails(classroomId);
    if (!classroomDetails) {
        throw new Error("Classroom not found");
    }
    if (classroomDetails.toJSON().tutorId !== tutorId) {
        throw new Error("This account doesn't have access to remove students from this classroom");
    }

    const studentData = await UserModel.getUserDetails(student);
    if (!studentData) {
        return;
    }

    await ClassroomModel.removeStudent(classroomId, studentData);
}

export const getFeed = async (role: ROLES, userId: number) => {
    let classroomFeed: ClassroomFeed[] = [];
    if (role === ROLES.STUDENT) {
        const classroomsByStudent = await ClassroomModel.getClassroomsByStudent(userId);
        _.forEach(classroomsByStudent, classroom => {
            const classroomDetails = classroom.toJSON();
            classroomFeed.push({
                className: classroomDetails.Classroom.className,
                classroomId: classroomDetails.Classroom.id
            });
        });
    }
    else {
        //Tutor feed
        const classroomsByTutor = await ClassroomModel.getClassroomsByTutor(userId);
        _.forEach(classroomsByTutor, classroom => {
            const classroomDetails = classroom.toJSON();
            classroomFeed.push({
                className: classroomDetails.className,
                classroomId: classroomDetails.id
            });
        });
    }

    return classroomFeed;
}