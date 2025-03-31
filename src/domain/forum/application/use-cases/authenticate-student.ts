import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentRepository } from '../repositories/student-repository'
import { CompareHash } from '../cryptography/compareHash'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateStudentsRequest {
  email: string
  password: string
}

type AuthenticateStudentsResponse = Either<
  WrongCredentialsError,
  {
    acessToken: string
  }
>

@Injectable()
export class AuthenticateStudentsUseCase {
  constructor(
    private studentsRepository: StudentRepository,
    private hashCompare: CompareHash,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentsRequest): Promise<AuthenticateStudentsResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPassword = await this.hashCompare.compare(
      password,
      student.password
    )

    if (!isPassword) {
      return left(new WrongCredentialsError())
    }

    const acessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({
      acessToken,
    })
  }
}
