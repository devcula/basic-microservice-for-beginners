import { ClassroomCreationAttributes } from "../interfaces/models.interface"
import { Classroom } from "../models/mysql"

export const createClassroom = async (className: string, tutorId: number) => {
    const classroomData: ClassroomCreationAttributes = {
        className,
        tutorId
    }
    const classroom = await Classroom.create(classroomData);
    return classroom;
}