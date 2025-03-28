import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionsAttachmentsRepository
  implements QuestionAttachmentRepository
{
  findManyQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    throw new Error('Method not implemented.')
  }
  deleteManyByQuesitonId(questionId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
