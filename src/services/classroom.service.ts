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