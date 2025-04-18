import { PaginationParams } from '@/core/repositories/pagenations-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAuthor } from '../../enterprise/entities/values-object/comment-with-author'

export abstract class QuestionCommentRepository {
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyQuestionId(
    questioId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>

  abstract findManyQuestionIdWithAuthor(
    questioId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>
  
  abstract delete(questionComment: QuestionComment): Promise<void>
}
