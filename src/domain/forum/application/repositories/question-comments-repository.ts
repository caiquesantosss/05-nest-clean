import { PaginationParams } from '@/core/repositories/pagenations-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'

export interface QuestionCommentRepository {
  create(questionComment: QuestionComment): Promise<void>
  findById(id: string): Promise<QuestionComment | null>
  findManyQuestionId(
    questioId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>
  delete(questionComment: QuestionComment): Promise<void>
}
