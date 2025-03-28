import { FetchQuestionCommentUseCase } from './fetch-question-comment-use-case'
import { UniqueEntityId } from '@/core/entities/unique-entity'
import { MakeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-questions-comments-repository'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionCommentUseCase

describe('Fetch Questions Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new FetchQuestionCommentUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to fetch a questions comments', async () => {
    await inMemoryQuestionCommentRepository.create(
      MakeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      })
    )
    await inMemoryQuestionCommentRepository.create(
      MakeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      })
    )
    await inMemoryQuestionCommentRepository.create(
      MakeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      })
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.questionsComments).toHaveLength(3)
  })

  it('should be able to fetch pagineted a questions comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        MakeQuestionComment({
          questionId: new UniqueEntityId('question-1'),
        })
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.questionsComments).toHaveLength(2)
  })
})
