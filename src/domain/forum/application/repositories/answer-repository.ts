import { PaginationParams } from '@/core/repositories/pagenations-params'
import { Answer } from '../../enterprise/entities/answer'

export abstract class AnswerRepository {
  abstract create(answer: Answer): Promise<void>
  abstract delete(answer: Answer): Promise<void>
  abstract save(answer: Answer): Promise<void>
  abstract findManyAnswersId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]>
  abstract findById(id: string): Promise<Answer | null>
}
