import { PaginationParams } from '@/core/repositories/pagenations-params'
import { Question } from '../../enterprise/entities/question'

export interface QuestionRepository {
  create(question: Question): Promise<void>
  save(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  findManyRecent(params: PaginationParams): Promise<Question[]>
  findBySlug(slug: string): Promise<Question | null>
  findById(id: string): Promise<Question | null>
}
