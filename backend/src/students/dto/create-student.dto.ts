export class CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  onePrep?: boolean;
  onlineCourse?: boolean;
}
