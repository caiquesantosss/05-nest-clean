import { PaginationParams } from '@/core/repositories/pagenations-params'
import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/values-object/question-details'

export abstract class QuestionRepository {
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
  abstract findById(id: string): Promise<Question | null>
}
