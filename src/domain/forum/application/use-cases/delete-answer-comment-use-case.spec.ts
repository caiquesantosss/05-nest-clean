import { DeleteAnswerCommentUseCase } from './delete-answer-comment-use-case'
import { MakeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentRepository } from 'test/repositories/in-memory-answer-coments-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentRepository
let inMemoryStudentRepository: InMemoryStudentRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Comment Question Use Case', () => {
  beforeEach(() => {
    inMemoryStudentRepository = new InMemoryStudentRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentRepository(
      inMemoryStudentRepository
    )

    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to delete a comment question', async () => {
    const questionComment = MakeAnswerComment()

    await inMemoryAnswerCommentRepository.create(questionComment)

    await sut.execute({
      answerCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryAnswerCommentRepository.items).toHaveLength(0)
  })

  it('should be not able to delete another user comment question', async () => {
    const questionComment = MakeAnswerComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryAnswerCommentRepository.create(questionComment)

    const result = await sut.execute({
      answerCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
