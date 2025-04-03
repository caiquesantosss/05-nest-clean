import { UniqueEntityId } from '@/core/entities/unique-entity'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error('Invalid attachment type.')
    }

    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id).toString(),
        questionId: new UniqueEntityId(raw.questionId).toString(),
      },
      new UniqueEntityId(raw.id)
    )
  }
}

