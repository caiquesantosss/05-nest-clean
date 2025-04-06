import { PaginationParams } from '@/core/repositories/pagenations-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswerCommentRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract findManyAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>
  abstract findById(id: string): Promise<AnswerComment | null>
  abstract delete(answerComment: AnswerComment): Promise<void>
}
