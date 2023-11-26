import { ClassroomCreationAttributes, ClassroomStudentAttributes } from "../interfaces/models.interface";
import { Classroom, ClassroomStudent, User } from "./mysql";
import _ from 'lodash';

export const createClassroom = async (className: string, tutorId: number) => {
    const classroomData: ClassroomCreationAttributes = {
        className,
        tutorId
    }
    const classroom = await Classroom.create(classroomData);
    return classroom;
}

export const addStudents = async (classroomId: number, studentsData: User[]) => {
    // Maybe refactor this fn later to accept students data in Attributes format instead of sequelize model?
    // Without that, it might not be that easier to reuse this.

    const classroomStudentData: ClassroomStudentAttributes[] = _.map(studentsData, student => {
        return {
            classroomId,
            studentId: student.get('id')
        }
    });

    await ClassroomStudent.bulkCreate(classroomStudentData);
}

export const getClassroomDetails = async (classroomId: number): Promise<Classroom> => {
    const classroom = await Classroom.findOne({
        where: { id: classroomId },
        attributes: ['id', 'tutorId'],
    });

    return classroom;
}

export const removeStudent = async (classroomId: number, student: User) => {
    await ClassroomStudent.destroy({
        where: {
            classroomId,
            studentId: student.get('id')
        }
    });
}

export const getClassroomsByTutor = async (tutorId: number) => {
    const classrooms = await Classroom.findAll({ where: { tutorId } });
    return classrooms;
}

export const getClassroomsByStudent = async (studentId: number) => {
    const classrooms = await ClassroomStudent.findAll({
        where: { studentId },
        include: {
            model: Classroom,
            attributes: ['id', 'className']
        }
    });

    return classrooms;
}