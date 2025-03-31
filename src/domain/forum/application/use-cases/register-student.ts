import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentRepository } from '../repositories/student-repository'
import { HashGenerator } from '../cryptography/hashGenerator'
import { StudentAlreadyExistsError } from './errors/student-alredy-exists-error'

interface RegisterStudentRequest {
  name: string
  email: string
  password: string
}

type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student
  }
>

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    
    const studentWithSameEmail = await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email)) 
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name, 
      email, 
      password: hashedPassword
    })

    await this.studentsRepository.create(student)

    return right({
      student
    })
  }
}
