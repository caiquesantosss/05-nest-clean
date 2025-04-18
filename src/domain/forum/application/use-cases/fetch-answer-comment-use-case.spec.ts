import { UniqueEntityId } from '@/core/entities/unique-entity'
import { FetchAnswerCommentUseCase } from './fetch-answer-comment-use-case'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-coments-repository'
import { MakeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: FetchAnswerCommentUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository
    )
    sut = new FetchAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to fetch a answers comments', async () => {
    const student = makeStudent({
      name: 'Tezinho',
    })

    inMemoryStudentRepository.items.push(student)

    const comment1 = MakeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })
    const comment2 = MakeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })
    const comment3 = MakeAnswerComment({
      answerId: new UniqueEntityId('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentRepository.create(comment1)
    await inMemoryAnswerCommentRepository.create(comment2)
    await inMemoryAnswerCommentRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: 'Tezinho',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: 'Tezinho',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          author: 'Tezinho',
          commentId: comment3.id,
        }),
      ])
    )
  })

  it('should be able to fetch pagineted a answers comments', async () => {

    const student = makeStudent({
      name: 'Tezinho',
    })

    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        MakeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: student.id
        })
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
