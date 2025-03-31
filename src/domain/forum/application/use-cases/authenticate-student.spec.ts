import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { FakeHasher } from 'test/cryptography/fake-hash'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateStudentsUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentRepository: InMemoryStudentRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentsUseCase

describe('Authenticate a student', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateStudentsUseCase(
      inMemoryStudentRepository,
      fakeHasher,
      fakeEncrypter
    )
  })

  it('should be able to authenticate a Student', async () => {
    const student = makeStudent({
      email: 'caiquesantosdamasceno@gmail.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryStudentRepository.items.push(student)

    const result = await sut.execute({
      email: 'caiquesantosdamasceno@gmail.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      acessToken: expect.any(String)
    })
  })
})
