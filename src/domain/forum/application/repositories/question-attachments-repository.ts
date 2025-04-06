import { PaginationParams } from '@/core/repositories/pagenations-params'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentRepository {
  abstract findManyQuestionId(questionId: string): Promise<QuestionAttachment[]>
  abstract deleteManyByQuesitonId(questionId: string): Promise<void>
}
