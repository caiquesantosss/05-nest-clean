import { PaginationParams } from '@/core/repositories/pagenations-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export abstract class QuestionCommentRepository {
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract findById(id: string): Promise<QuestionComment | null>
  abstract findManyQuestionId(
    questioId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>
  abstract delete(questionComment: QuestionComment): Promise<void>
}
