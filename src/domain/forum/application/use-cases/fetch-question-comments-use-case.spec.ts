import { FetchQuestionCommentUseCase } from './fetch-question-comment-use-case'
import { UniqueEntityId } from '@/core/entities/unique-entity'
import { MakeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryStudentRepository: InMemoryStudentRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentUseCase

describe('Fetch Questions Comments', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudentRepository
    )
    sut = new FetchQuestionCommentUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to fetch a questions comments', async () => {
    const student = makeStudent({
      name: 'Tezinho',
    })

    inMemoryStudentRepository.items.push(student)

    const comment1 = MakeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })
    const comment2 = MakeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })
    const comment3 = MakeQuestionComment({
      questionId: new UniqueEntityId('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentRepository.create(comment1)
    await inMemoryQuestionCommentRepository.create(comment2)
    await inMemoryQuestionCommentRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
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

  it('should be able to fetch pagineted a questions comments', async () => {
    const student = makeStudent({
      name: 'Tezinho',
    })

    inMemoryStudentRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        MakeQuestionComment({
          questionId: new UniqueEntityId('question-1'),
          authorId: student.id
        })
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
