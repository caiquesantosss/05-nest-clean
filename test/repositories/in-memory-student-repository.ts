import { Student } from '../../src/domain/forum/enterprise/entities/student'
import { DomainEvents } from '../../src/core/events/domain-events'
import { StudentRepository } from '@/domain/forum/application/repositories/student-repository'

export class InMemoryStudentRepository implements StudentRepository {
  public items: Student[] = []

  async create(student: Student) {
    this.items.push(student)

    DomainEvents.dispatchEventsForAggregate(student.id)
  }

  async findByEmail(email: string) {
    const student = this.items.find((item) => item.email.toString() === email)

    if (!student) {
      return null
    }
    return student
  }
}
