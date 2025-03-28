import { UniqueEntityId } from '@/core/entities/unique-entity'
import { FetchAnswerCommentUseCase } from './fetch-answer-comment-use-case'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-coments-repository'
import { MakeAnswerComment } from 'test/factories/make-answer-comment'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerCommentUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new FetchAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to fetch a answers comments', async () => {
    await inMemoryAnswerCommentRepository.create(
      MakeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      })
    )
    await inMemoryAnswerCommentRepository.create(
      MakeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      })
    )
    await inMemoryAnswerCommentRepository.create(
      MakeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      })
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch pagineted a answers comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentRepository.create(
        MakeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
        })
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
