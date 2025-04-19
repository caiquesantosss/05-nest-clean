import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-questions-comments-repository'
import { CommentOnQuestionUseCase } from './comment-on-question-use-case'
import { DeleteQuestionCommentUseCase } from './delete-question-comment-use-case'
import { MakeQuestionComment } from 'test/factories/make-question-comment'
import { UniqueEntityId } from '@/core/entities/unique-entity'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-student-repository'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let inMemoryStudenRepository: InMemoryStudentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Comment Question Use Case', () => {
  beforeEach(() => {
    inMemoryStudenRepository = new InMemoryStudentRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(
      inMemoryStudenRepository
    )

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to delete a comment question', async () => {
    const questionComment = MakeQuestionComment()

    await inMemoryQuestionCommentRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentRepository.items).toHaveLength(0)
  })

  it('should be not able to delete another user comment question', async () => {
    const questionComment = MakeQuestionComment({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryQuestionCommentRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
