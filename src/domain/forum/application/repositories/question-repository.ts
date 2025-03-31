import { PaginationParams } from '@/core/repositories/pagenations-params'
import { Question } from '../../enterprise/entities/question'

export abstract class QuestionRepository {
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findById(id: string): Promise<Question | null>
}
