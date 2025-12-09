import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  async create(createStudentDto: CreateStudentDto) {
    const firstName = createStudentDto.firstName;
    const lastName = createStudentDto.lastName;

    // Auto-generate email: sat+<lowercase firstname><first initial of lastname>@homeworkhelperstutoring.com
    const email =
      createStudentDto.email.toLowerCase();
    // Auto-generate password: Homework_<Capitalized firstname>1!
    const password =
      createStudentDto.password;

    const student = await prisma.student.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        onePrep: createStudentDto.onePrep ?? false,
        onlineCourse: createStudentDto.onlineCourse ?? false,
      },
    });
    return student;
  }

  async findAll() {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return students;
  }
}
