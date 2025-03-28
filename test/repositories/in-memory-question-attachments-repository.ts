import { PaginationParams } from '../../src/core/repositories/pagenations-params'
import { QuestionAttachmentRepository } from '../../src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '../../src/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{

  public items: QuestionAttachment[] = []

  async findManyQuestionId(questioId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questioId
    )

    return questionAttachments
  }

  async deleteManyByQuesitonId(questioId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questioId
    )

    this.items = questionAttachments
  }
}
