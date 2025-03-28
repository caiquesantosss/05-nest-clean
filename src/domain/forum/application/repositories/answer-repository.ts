import { PaginationParams } from '@/core/repositories/pagenations-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswerRepository {
  create(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  findManyQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
  findById(id: string): Promise<Answer | null>
}
