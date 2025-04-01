import { UniqueEntityId } from '@/core/entities/unique-entity'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Slug } from '@/domain/forum/enterprise/entities/values-object/slug'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
