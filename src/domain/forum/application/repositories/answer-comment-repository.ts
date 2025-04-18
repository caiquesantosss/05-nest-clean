import { PaginationParams } from '@/core/repositories/pagenations-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprise/entities/values-object/comment-with-author'

export abstract class AnswerCommentRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract findManyAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>

  abstract findManyAnswerIdWithAuthor(
      questioId: string,
      params: PaginationParams
    ): Promise<CommentWithAuthor[]>
    
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
