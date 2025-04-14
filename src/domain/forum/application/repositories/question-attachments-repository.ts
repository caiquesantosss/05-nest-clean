import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

export abstract class QuestionAttachmentRepository {
  abstract createMany(attachments: QuestionAttachment[]): Promise<void>
  abstract deleteMany(attachments: QuestionAttachment[]): Promise<void>


  abstract findManyQuestionId(questionId: string): Promise<QuestionAttachment[]>
  abstract deleteManyByQuesitonId(questionId: string): Promise<void>
}
