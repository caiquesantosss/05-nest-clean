import {
  Student,
  StudentProps,
} from '../../src/domain/forum/enterprise/entities/student'
import { UniqueEntityId } from '../../src/core/entities/unique-entity'
import { faker } from '@faker-js/faker'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityId
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  )

  return student
}
