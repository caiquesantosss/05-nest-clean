import { PaginationParams } from '@/core/repositories/pagenations-params'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'


export interface QuestionAttachmentRepository {
  findManyQuestionId(questionId: string): Promise<QuestionAttachment[]>
  deleteManyByQuesitonId(questionId: string): Promise<void>
}
