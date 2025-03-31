import { UniqueEntityId } from '@/core/entities/unique-entity'
import { CreateQuestionUseCase } from './create-question-use-case'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hash'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register a student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()

    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentRepository, fakeHasher)
  })

  it('should be able to register a new Student', async () => {
    const result = await sut.execute({
      name: 'Caique',
      email: 'caiquesantosdamasceno@gmail.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentRepository.items[0],
    })
  })

  it('should hash Student password upon registrations', async () => {
    const result = await sut.execute({
      name: 'Caique',
      email: 'caiquesantosdamasceno@gmail.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentRepository.items[0].password).toEqual(hashedPassword)
  })
})
